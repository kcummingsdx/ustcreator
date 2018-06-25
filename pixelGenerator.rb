#! /usr/bin/env ruby
require File.expand_path(File.join(File.dirname(__FILE__),'../config/environment.rb'))

class PixelCreator
  include BinDiesel

  USAGE = "Usage: ruby bin/pixel_creator.rb -s segment-list.txt -c config.yaml"

  opts_banner USAGE

  opts_description "Creates pixels, segments, and audiences (if selected in the config.yaml) for a given advertiser"

  opts_on "-c", "--config [FILE]", "Provide the config YAML" do |file|
    begin
      @props = YAML.load_file(file)
    rescue
      print_err("Props file could not be loaded")
      exit unhappy_ending
    end
  end

  opts_on "-s", "--segments [FILE]", "Provide the segments file" do |file|
    begin
      @segments_costs = IO.readlines(file)
    rescue
      print_err("Segment list file could not be loaded")
      exit unhappy_ending
    end
  end

  def post_initialize
    # Variables
    if @segments_costs.blank? or @props.blank?
      print_blank_err("Segments list or props")
      exit unhappy_ending
    end

    agency_group_name = @props["agencygroup"]
    if agency_group_name.blank?
      print_blank_err("agencygroup")
      exit unhappy_ending
    end

    agency_name = @props["agency"]
    if agency_name.blank?
      print_blank_err("agency")
      exit unhappy_ending
    end

    advertiser_name = @props["advertiser"]
    if advertiser_name.blank?
      print_blank_err("advertiser")
      exit unhappy_ending
    end

    @segment_expiry = @props["expiry"]
    if @segment_expiry.blank?
      @segment_expiry = 90
    end

    aud_string = @props["audiences"]
    @include_audiences = (aud_string.present? and (aud_string == true or aud_string.downcase == "true"))

    @advertiser = get_advertiser(agency_group_name, agency_name, advertiser_name)
    exit unhappy_ending if @advertiser.blank?
  end

  run do
    ##################
    # RUN THE SCRIPT #
    ##################
    if main
      print_info "Completed successfully"
    else
      print_info "Experienced one or more errors and could not complete successfully"
    end
  end

  private
  ####################
  # MAIN ENTRY POINT #
  ####################
  def main
    print_info "Starting pixel creation\n"
    create_pixels(@segments_costs, @advertiser, @include_audiences)
  end

  def create_pixels(segments_list, advertiser, include_audiences)
    add         = RetargetingType.where(:name => 'Add').first
    data_vendor = DataVendor.dataxu
    pixel_arr   = []
    begin
      ActiveRecord::Base.transaction do
        begin
          segments_list.each do |segment_info|
            segment_ar = segment_info.split(',')
            name = segment_ar[0].gsub("\n","")
            info = "Creating segment, activity, retargeting action"
            info += ", audience" if include_audiences
            print_info "#{info} for #{name}"

            activity = create_activity(advertiser, name)
            raise unless activity.present?

            pixel_arr << [name, activity.uid, activity.pixel_id]

            segment = create_segment(advertiser, name, data_vendor, @segment_expiry)
            raise unless segment.present?

            r = RetargetingAction.find_or_initialize_by_activity_id_and_segment_id_and_retargeting_type_id(activity.id, segment.id, add.id)
            unless r.save
              print_err(
                "Exception creating retargeting action with name '#{name}'.\n" \
                "Error message(s):\n#{r.errors.full_messages.join("\n")}")
              raise
            end

            if include_audiences
              cost = price = 0
              if segment_ar.length >= 3
                cost = segment_ar[1].gsub("\n","")
                price = segment_ar[2].gsub("\n","")
              end

              audience = create_audience(advertiser, name, segment, data_vendor, cost, price, @segment_expiry)
              raise unless audience.present?
            end
          end
        rescue Exception => e
          # This will be blank when we WANT to raise an exception
          unless e.to_s.blank?
            print_err "An unknown exception occurred: #{e.to_s}\n#{e.backtrace.join("\n")}"
          end
          raise
        end
      end
    rescue
      return false
    end
    print_info "\nActivity Name, Activity UID, Pixel ID\n#{pixel_arr.map { |f| f.join(",") }.join("\n")}"
    true
  end

  #########################
  # PIXEL CREATOR HELPERS #
  #########################

  def create_activity(advertiser, name)
    activity = advertiser.activities.find_or_initialize_by_name name
    success  = activity.update_attributes({
      :activity_type   => ActivityType.marketing.first,
      :rmx             => false,
      :secure          => false,
      :sharing_enabled => true
    })

    if success
      activity
    else
      print_err "Exception creating activity with name '#{name}'.\nError message(s):\n#{activity.errors.full_messages.join("\n")}"
    end
  end

  def create_segment(advertiser, name, data_vendor, segment_expiry = 90)
    segment = advertiser.first_party_segments.find_or_initialize_by_name name
    success = segment.update_attributes({ :data_vendor => data_vendor, :expiration => segment_expiry })
    if success
      segment
    else
      print_err "Exception creating activity with name '#{name}'.\nError message(s):\n#{segment.errors.full_messages.join("\n")}"
    end
  end

  def create_audience(advertiser, name, segment, data_vendor, cost = 0, price = 0, segment_expiry = 90)
    audience = advertiser.composite_segments.find_or_initialize_by_name name
    success  = audience.update_attributes({
      :data_vendor   => data_vendor,
      :expiration    => segment_expiry,
      :composed_with => "ADVANCED",
      :expression    => {
        'operator'       => "AND",
        'sub_predicates' => [
          {
            'label' => 'A',
            'uid'   => segment.uid
          }
        ]
      }.to_json,
      :primitive_rates_attributes => [
        {
          :segment_id  => segment.id,
          :cost        => cost,
          :price       => price,
          :currency_id => advertiser.currency.id
        }
      ]
    })

    if success
      audience
    else
      print_err "Exception creating audience with name '#{name}', cost '#{cost}', price '#{price}'.\nError message(s):\n#{audience.errors.full_messages.join("\n")}"
    end
  end

  ###################
  # GENERIC HELPERS #
  ###################

  def print_blank_err(blank_entry)
    print_err "#{blank_entry} was empty or missing"
  end

  def print_err(entry)
    error_message "[PIXEL CREATOR ERROR]: #{entry}"
  end

  def print_info(entry)
    info_message "[PIXEL CREATOR INFO]: #{entry}"
  end

  def get_advertiser(agency_group_name, agency_name, advertiser_name)
    # Get advertiser from agency group, agency and advertiser.
    agency_group = AgencyGroup.where(:name => agency_group_name).first
    if agency_group.blank?
      print_err "No agency group with name '#{agency_group_name}'"
      return
    end

    agency = agency_group.agencies.where(:name => agency_name).first
    if agency.blank?
      print_err "No agency with name '#{agency_name}' in agency group '#{agency_group_name}'"
      return
    end

    advertiser = agency.advertisers.where(:name => advertiser_name).first
    if advertiser.blank?
      print_err "No advertiser with name '#{advertiser_name}' in agency '#{agency_name}' in agency group '#{agency_group_name}'"
      return
    end

    advertiser
  end
end

exit PixelCreator.new(ARGV).run