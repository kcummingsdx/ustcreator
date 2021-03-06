(function() {

  var UNSAFE_CHAR_LIST = ['|'];

  var encodeUnsafe = function(param) {

    if (!param) {
      return param;
    }

    var needsEncoding = false;
    for (var index = 0; index < UNSAFE_CHAR_LIST.length; index++) {
      if (param.indexOf(UNSAFE_CHAR_LIST[index]) > -1) {
        needsEncoding = true;
        break;
      }
    }

    if (needsEncoding) {
      return encodeURIComponent(param);
    }

    return param;
  };

  var firePixel = function (pixelIds) {
    if (pixelIds === '') {
      return;
    }

    var dxDomain = '//tags.w55c.net/rs?id=';
    var pixels = pixelIds.split(',');

    for (var i = 0; i < pixels.length; i++) {
      var dxPixelId = pixels[i];
      var cb = Math.floor(Math.random() * 99999);
      var pixelSrc = dxDomain + dxPixelId + '&rnd=' + cb;
      if (paramPixelMap.hasOwnProperty(dxPixelId) && btData != null) {
        // If we find a match, we need to add parameters
        type = paramPixelMap[dxPixelId];
        var sku = encodeUnsafe(btData.list_sku);
        if (type === 'CART') {
          var price = encodeUnsafe(btData.sc_total);
          pixelSrc = pixelSrc + '&sku=' + sku + '&price=' + price;
        } else if (type === 'CONV') {
          var price = encodeUnsafe(btData.web_order_merchandise_total);
          var tx = encodeUnsafe(btData.web_order_id);
          pixelSrc = pixelSrc + '&sku=' + sku + '&price=' + price + '&tx=' + tx;
        }
      }
      var img = document.createElement('img');
      img.src = pixelSrc;
    }
  };

  // fire pixel only if the URL matches all substrings specified in the key (comma delimited)
  var fireSubstringPixels = function(normUrl) {
    url = normUrl.toLowerCase();
    pixelIds = [];

    for (var key in urlSubstringMap) {
      if (urlSubstringMap.hasOwnProperty(key)) {
        pixelId = urlSubstringMap[key];
        substrs = key.split(',');
        matched = true;

        for (var i = 0; i < substrs.length; i++) {
          substrMatch = substrs[i];
          if (!url.includes(substrMatch)) {
            matched = false;
            break;
          }
        }

        if (matched) {
          pixelIds.push(pixelId);
        }
      }
    }

    return pixelIds;
  };

  var normalizeUrl = function (normURL) {
    var replacedURL = normURL.replace(/^https?:\/\//, '');

    if (replacedURL.substr(-1) == '/') {
      replacedURL = replacedURL.substr(0, replacedURL.length - 1);
    }

    return replacedURL;
  };

  /* Main function to fire pixel based on matching the current URL to the URL Map */
  var dxUpx = function () {
    // This represents a list of pixel ids to fire.  The default is the diagnostic pixel.
    var dxPixelIds = '974ce3b683784b43b498322782c87dc2';
    var normalizedUrl = normalizeUrl(window.location.href);

    if (urlMap.hasOwnProperty(normalizedUrl)) {
      // If we find a match, replace the diagnostic pixel with those associated with the URL.
      dxPixelIds = urlMap[normalizedUrl];
    }

    substringPixels = fireSubstringPixels(normalizedUrl);
    dxPixelIds += ',' + substringPixels.join();
    firePixel(dxPixelIds);
  };

  var paramPixelMap = {
    '4a47a1e03c9d47408146eeda159018a4': 'CART',
    '2b3bcf77d4e4494bac811a622b449e7a': 'CART',
    '0b122710aaf24fe098a3e1b45e12793e': 'CONV',
    'f8523adb3b1e4cf99441b74c1e65076b': 'CONV',
    'a78b277c331c4b348dbccd051376e2ce': 'CONV',
    'f7238e98e32848b9aef2ddb4d814262e': 'CONV'
  };

  var urlMap = {
    'www.americansignaturefurniture.com' : '1746c05e9290431fbee558c59ba10c5b',
    'www.americansignaturefurniture.com/about-us' : '4f891ecbdf224fc9a7c8c3ff43113bdb',
    'www.americansignaturefurniture.com/search/a/accents/furniture/tv-stands-media-centers' : '6c5f03347da14ea6adf35e89131aab00',
    'www.americansignaturefurniture.com/search/a/accents/furniture/home-office' : '3a09a4d5e8744419aefbe0cc97d81374',
    'www.americansignaturefurniture.com/search/a/accents/furniture/bookcases' : '409f50a6b1bb47fc9c747b72dc072a79',
    'www.americansignaturefurniture.com/search/a/accents/furniture/chairs' : '35d4bd49b31e4d3abaebeb76be27249d',
    'www.americansignaturefurniture.com/search/a/accents/furniture/ottomans' : 'c4a8e648f5a04ce1a15c34199dfc69fb',
    'www.americansignaturefurniture.com/search/a/accents/furniture/fireplaces' : '34d1c440ddc24210b0b34a563f915cac',
    'www.americansignaturefurniture.com/search/a/accents/furniture/benches-settees' : '0c20df136c0a435eb8ad4b859b52b85a',
    'www.americansignaturefurniture.com/search/a/accents/furniture/bars' : '20476cfb3cc748c4bef324a8443a0032',
    'www.americansignaturefurniture.com/search/a/accents/furniture/accent-tables' : '5e1081098a9f4b738f9003bb60844a9f',
    'www.americansignaturefurniture.com/search/a/accents/home-accessories/bed-linens' : '6238672366ad4bc1a40b33300547212f',
    'www.americansignaturefurniture.com/search/a/accents/home-accessories/wall-art' : '500f915bd89e4ac5af09cb705b653683',
    'www.americansignaturefurniture.com/search/a/accents/home-accessories/mirrors' : '0c2d21904c6d4b3eb59b8b346e9f2406',
    'www.americansignaturefurniture.com/search/a/accents/home-accessories/pillows' : '61151a103e864140809d7ae8c043b3b5',
    'www.americansignaturefurniture.com/search/a/accents/home-accessories/lighting' : '8cc06f1c0b0d495d91809069c11233db',
    'www.americansignaturefurniture.com/search/a/accents/home-accessories/rugs' : 'e9bee10b4b1747ee89835b0db8f302b7',
    'www.americansignaturefurniture.com/search/a/accents' : '4f99cf99f2834074bd7872e5ed7030d5',
    'www.americansignaturefurniture.com/search/a/accents/patio/outdoor-chairs' : '1e1fd402a3a44f60a712d1f73a0be1d8',
    'www.americansignaturefurniture.com/search/a/accents/patio/outdoor-tables' : '633fccf3a75741ce8016ae779c2bfa48',
    'www.americansignaturefurniture.com/search/a/accents/patio/outdoor-dinettes' : '524d1912c1964cb98f0801d1ac5413ac',
    'www.americansignaturefurniture.com/search/a/accents/patio/outdoor-sofas' : '773dbf0469d741b9a274302001722784',
    'www.americansignaturefurniture.com/search/a/accents/patio/outdoor-sectionals' : '53c161828e12468db705861bebf4345d',
    'www.americansignaturefurniture.com/search/a/accents/quick-links/shop-by-brand' : '1de71361511241ba8691b539172d50d1',
    'www.americansignaturefurniture.com/search/a/accents/quick-links/shop-all-accents' : '2b9f2099f727497bb4451c6a053802a6',
    'www.americansignaturefurniture.com/search/a/accents/quick-links/shop-all-patio' : '3de2aa5f8c36410fb7fcddfdcf15524a',
    'www.americansignaturefurniture.com/search/a/accents/quick-links/see-our-best-sellers' : '1d0954d503274b988183290ad73ea836',
    'www.americansignaturefurniture.com/search/a/accents/quick-links/see-our-patio-packages' : '07729a76669a4f2e80d9b53c4c60cb2d',
    'www.americansignaturefurniture.com/search/a/accents/quick-links/shop-all-free-shipping' : '3a2a0f209c1c4af2b4281d4730021fb4',
    'www.americansignaturefurniture.com/account/register' : '743d78e1bcfa436f92a45f8fa1fe3b6c',
    'www.americansignaturefurniture.com/account/sign-in' : '5ca1415746744f0d9fadcbc899fe4302',
    'www.americansignaturefurniture.com/account/wish-list' : '1594d8d583f04e47ac8bb587ad986a42',
    'www.americansignaturefurniture.com/account' : 'e01a1aaaf4084ec484dd45e5abe3cbd8',
    'www.americansignaturefurniture.com/search/a/bedroom/accents/pillows' : '52676df44f244238bd6cd5e5deee43aa',
    'www.americansignaturefurniture.com/search/a/bedroom/accents/bed-linens' : '82d6b7d1bd0e4b9d86bb317b448aa398',
    'www.americansignaturefurniture.com/search/a/bedroom/accents/lighting' : '6c02d30144f34c12893a3b3ec59644ec',
    'www.americansignaturefurniture.com/search/a/bedroom/accents/wall-art' : '7dd70b9563dc4c7eb07992ea4f4eed33',
    'www.americansignaturefurniture.com/search/a/bedroom/accents/mirrors' : 'ace009f24c524ee7a87df683515c60b0',
    'www.americansignaturefurniture.com/search/a/bedroom/accents/rugs' : '472e31e248b64512b7b29eb002cda6ed',
    'www.americansignaturefurniture.com/search/a/bedroom/accents/all-accent-pieces' : '0c2069a92111491085ae649e423c43aa',
    'www.americansignaturefurniture.com/search/a/bedroom/beds/twin-beds' : '3f80fa1469e149aca7ad716372f469ad',
    'www.americansignaturefurniture.com/search/a/bedroom/beds/full-beds' : 'ff10afb7adfa476b8662b87af8034275',
    'www.americansignaturefurniture.com/search/a/bedroom/beds/queen-beds' : '9249c731f968490fad47c7c7fa865643',
    'www.americansignaturefurniture.com/search/a/bedroom/beds/king-beds' : '7514d9e873ee4d59b4ab7920cdc0720a',
    'www.americansignaturefurniture.com/search/a/bedroom/beds/daybeds' : '53fc69d460b74761bd72a71473b00f10',
    'www.americansignaturefurniture.com/search/a/bedroom/beds/futons' : '4c0f1fbee8e84d398843a41c37b9fe82',
    'www.americansignaturefurniture.com/search/a/bedroom/beds/headboards' : '90381d6f674043efa8fccf4cddf26309',
    'www.americansignaturefurniture.com/search/a/bedroom/beds/bunk-beds-loft-beds' : '60d7a4dc6ac642619fe9c5b872c89018',
    'www.americansignaturefurniture.com/search/a/bedroom/cabinets-storage/dressers' : '060d355f88174bb498ea821a94243378',
    'www.americansignaturefurniture.com/search/a/bedroom/cabinets-storage/chests' : '75b612ae4f1e4885a65386f535270b83',
    'www.americansignaturefurniture.com/search/a/bedroom/cabinets-storage/nightstands' : 'f26a6060753443ec9119d2394f4cd624',
    'www.americansignaturefurniture.com/bedroom-furniture' : 'af7b04ddfa10490b8f565bed30e3621b',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/shop-by-brand' : '0cf9ce004ae24b7880e13461d6f0813d',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/shop-for-5-piece-bedrooms' : '5e3a8042b9d0473d8e380807dfea1e9c',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/shop-for-6-piece-bedrooms' : '56dfa3b66e1f4262b02cb38664bf0cb4',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/shop-all-bedroom' : 'bc582b804ea442db8ab986161d55143b',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/see-whats-on-sale' : '43d286d10fb0487fa6235c536a51e390',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/see-our-bedroom-packages' : '21fe8e85631c48309739a75183211d15',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/see-our-best-sellers' : '219dd0c8b60c462495b8f0dc9a6dbddc',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/see-our-collections' : '0497caf05cd342b2a5c2ab027668accf',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/shop-all-kids' : '082937c08fdd47caa81d1faf5a95549f',
    'www.americansignaturefurniture.com/search/a/bedroom/quick-links/see-our-kids-collections' : 'a4a787d7690647b1b661b148e990843a',
    'www.americansignaturefurniture.com/search/a/bedroom/seating/benches-settees' : '6fa17c14b20843e195bb83b81fae7902',
    'www.americansignaturefurniture.com/search/a/bestsellers' : '12e7bcc5b9ca4359b656b2408a22af8d',
    'www.americansignaturefurniture.com/bestsellers.aspx' : '323d2ff179e0402f85e0b4cf28508b0b',
    'www.americansignaturefurniture.com/blog' : 'fdf6bafe43a54f8d9d7a3a741b7d090e',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/kroehler' : '8196a30499b544f681674f3c78f9e2b4',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/nijarian' : '5778dc9db6744a599660ff847416af88',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/pulaski' : '07074c4ade8749b490aa655c0fdde5fc',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/one80' : '33a04b804511488f9f8fd876e914a781',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/apt-1710' : '913b7049c9464e59a7c0f713c3c9a915',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/passport' : '31e171267c104f0bb1d203da31a9c2df',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/vie-boutique' : 'b5f0b8fbacd64b1c9fb0e307eb9c3a7b',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/steve-silver' : 'cbd8bf2909ec40ac9a42c31af767fefa',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/american-signature' : 'd78250e8c6074cf6bed23ebef73a8fd2',
    'www.americansignaturefurniture.com/search/a/brands/our-furniture-brands/factory-outlet' : '54e603d57236493da18009fa5f90cc24',
    'www.americansignaturefurniture.com/search/a/brands/our-mattress-brands/perfect-sleeper' : '3ef5d95c49be400488a6f8e4150c4a12',
    'www.americansignaturefurniture.com/search/a/brands/our-mattress-brands/iSeries' : '7f5fcb8055984d38ab9e267211856aa6',
    'www.americansignaturefurniture.com/search/a/brands/our-mattress-brands/iComfort' : '1f2981ab63af458caac88bae4f45188d',
    'www.americansignaturefurniture.com/search/a/brands/our-mattress-brands/miraclefoam' : '5fbce51a653948cb81ebace0d358f1b2',
    'www.americansignaturefurniture.com/search/a/brands/our-mattress-brands/beautyrest' : '3eefe15805aa44159177e83935959690',
    'www.americansignaturefurniture.com/search/a/brands/our-mattress-brands/serta' : '37afa1e696dc46b584bdbd306c7b8f4e',
    'www.americansignaturefurniture.com/search/a/brands/our-mattress-brands/simmons' : '307989f7dd204643b2bc7c55b63aba2d',
    'www.americansignaturefurniture.com/buying-guides' : '660aa994c615456ba7ac56621e1ffdb8',
    'www.americansignaturefurniture.com/careers' : '959bd2056d6148509d4839cc53f86656',
    'www.americansignaturefurniture.com/contact-us' : '69e29f50a3074f4eaa4b70283bf1b6aa',
    'www.americansignaturefurniture.com/search/a/dining-room/accents/lighting' : '5e2fc5188535432cae4df8c1c28dc5d4',
    'www.americansignaturefurniture.com/search/a/dining-room/accents/wall-art' : '99ca5cc0546c474f8a615d5ac5c8dc8f',
    'www.americansignaturefurniture.com/search/a/dining-room/accents/mirrors' : '1c02b0ab74ad43848ab27aef411d5bd8',
    'www.americansignaturefurniture.com/search/a/dining-room/accents/bars' : 'aae3f440ad8a4037bf9fce9671240d2d',
    'www.americansignaturefurniture.com/search/a/dining-room/accents/all-accent-pieces' : '680dd7d7a5734b7cac42d7d5e4ae2a32',
    'www.americansignaturefurniture.com/search/a/dining-room/cabinets-storage/buffets-sideboards' : '92470bf4266f4e509ba8fd59b291b550',
    'www.americansignaturefurniture.com/search/a/dining-room/cabinets-storage/china-cabinets-curios' : '6d1b5b841c02457ab0bf0e73563160cf',
    'www.americansignaturefurniture.com/dining-room-furniture' : '38f334fa9a704b3d9e878582884f0578',
    'www.americansignaturefurniture.com/search/a/dining-room' : '41036a45d7da43da9f104d87264d5b1c',
    'www.americansignaturefurniture.com/search/a/dining-room/quick-links/shop-by-brand' : '545a24ff0e4d405aa2cfb76272066cfc',
    'www.americansignaturefurniture.com/search/a/dining-room/quick-links/shop-for-5-piece-dining-rooms' : 'c605147917a840e7b46961d13e8fff5a',
    'www.americansignaturefurniture.com/search/a/dining-room/quick-links/shop-for-7-piece-dining-rooms' : '53e05883785f4df2b59d1b3865f51cd0',
    'www.americansignaturefurniture.com/search/a/dining-room/quick-links/see-whats-on-sale' : '286dc3c92f294792abca3135c2bb2a39',
    'www.americansignaturefurniture.com/search/a/dining-room/quick-links/see-our-best-sellers' : '58939ba6b0514a15baacbf8a7dbcb713',
    'www.americansignaturefurniture.com/search/a/dining-room/quick-links/see-our-collections' : '192380a014e2495f8d6600071e56d222',
    'www.americansignaturefurniture.com/search/a/dining-room/seating/dining-chairs' : 'c3884c02bc4047099b868946d2116367',
    'www.americansignaturefurniture.com/search/a/dining-room/seating/counter-bar-stools' : 'b3acc7809a5248d7aa95f675d3b33f9d',
    'www.americansignaturefurniture.com/search/a/dining-room/seating/benches' : '3adb917982a4495e811095e08fc3802a',
    'www.americansignaturefurniture.com/search/a/dining-room/tables/dining-tables' : 'd0ebc4c312374c43b3d7e476feeff3c6',
    'www.americansignaturefurniture.com/search/a/dining-room/tables/dinettes' : '9c2b5eec5e0a4c7eae4c2aa88166a108',
    'www.americansignaturefurniture.com/easy-pass' : 'f92695a42cee409082753d2df28c7e6f',
    'www.americansignaturefurniture.com/financing' : '55a49867767e4343ad980d0c94934a39',
    'www.americansignaturefurniture.com/frequently-asked-questions' : '53b0e58745654910859ab4bbc5094792',
    'www.americansignaturefurniture.com/giftcard' : 'bb50a7fff1e54edcaaaf08937623d223',
    'www.americansignaturefurniture.com/home' : 'e06e2ef7d73c48aa96e069116f0711c1',
    'www.americansignaturefurniture.com/search/home-decor' : '5df691060fa041edad01382d60482d1e',
    'www.americansignaturefurniture.com/search/a/inspiration/pinterest' : 'b12a4a699c954015b6d505f1337e32b9',
    'www.americansignaturefurniture.com/is-new.aspx' : '7b364cfb81cc486f9e64a4c63b21780c',
    'www.americansignaturefurniture.com/search/a/kids/beds/twin-beds' : '8da642d1a6e44ca780316c8cb467c470',
    'www.americansignaturefurniture.com/search/a/kids/beds/full-beds' : 'c12d0b1c546e4e14afa510202c25e11f',
    'www.americansignaturefurniture.com/search/a/kids/beds/bunk-beds-loft-beds' : '4d92a44f158d40f5b9b4c3bcaa2dfa58',
    'www.americansignaturefurniture.com/search/a/kids/cabinets-storage/dressers-chests' : '20ad14b0f34a4ac3b322727e64b53f26',
    'www.americansignaturefurniture.com/search/a/kids/cabinets-storage/nightstands' : '9935c7f7ff8d4c24827f11c4b0dfe82e',
    'www.americansignaturefurniture.com/search/a/kids/accents/bed-linens' : '224d52de3ec549e2bf4c1db556cb3f52',
    'www.americansignaturefurniture.com/search/a/kids/accents/chairs-chaises' : 'cb9ec86c36fd4581b7be1c9ce3bbbb99',
    'www.americansignaturefurniture.com/search/a/kids/accents/lighting' : '97fd994d99e54606ae6a86a6ae6513a3',
    'www.americansignaturefurniture.com/search/a/kids/accents/all-accent-pieces' : 'cabee3ee7e014aa3ab13e668bd2c85cb',
    'www.americansignaturefurniture.com/search/a/kids/quick-links/shop-by-brand' : '01263bd1c345478b8282f37191dc5c4d',
    'www.americansignaturefurniture.com/search/a/kids/quick-links/shop-all-kids-furniture' : 'e3b3576e7ff24c91bdefd7242d3fd44a',
    'www.americansignaturefurniture.com/search/a/kids/quick-links/see-whats-on-sale' : 'ab0b1f14c5c24138816010e110d05ccc',
    'www.americansignaturefurniture.com/search/a/kids/quick-links/see-our-kids-furniture-packages' : '86fd6cb089ea43d597cad7d4bf2375dc',
    'www.americansignaturefurniture.com/search/a/kids/quick-links/see-our-bestsellers' : 'fb482a1cb1aa45eca176c1c3cf93de9d',
    'www.americansignaturefurniture.com/search/a/kids/quick-links/see-our-collections' : '454559f6c77a4e95904ef70c5021ce7d',
    'www.americansignaturefurniture.com/search/a/living/cabinets-storage/accent-chests' : '9def40be64ac4583876659fefe5ed8bc',
    'www.americansignaturefurniture.com/search/a/living-room/accents/fireplaces' : '47c54d6b95264dc3b63a941cfabecf36',
    'www.americansignaturefurniture.com/search/a/living-room/accents/rugs' : '478b31901e5d4b338a191f5d12e11693',
    'www.americansignaturefurniture.com/search/a/living-room/accents/pillows' : '49e66a6b7fb74a93adc04c84c04babd0',
    'www.americansignaturefurniture.com/search/a/living-room/accents/lighting' : '938b27ab71cc4ec983a630910314cb55',
    'www.americansignaturefurniture.com/search/a/living-room/accents/wall-art' : 'e28fb1bcd2534dcea2149e75cfabf3e4',
    'www.americansignaturefurniture.com/search/a/living-room/accents/mirrors' : 'd41f6ee023324234931334a6559e62e4',
    'www.americansignaturefurniture.com/search/a/living-room/accents/all-accent-pieces' : '21fce72d877b4c82a5383975a7c743f8',
    'www.americansignaturefurniture.com/search/a/living-room/cabinets-storage/tv-stands-media-centers' : 'bf2b13e667db4cc1973c60f6f0a27c62',
    'www.americansignaturefurniture.com/search/a/living-room/cabinets-storage/bookcases' : 'c512a82428244b65b9845dcad366d1c6',
    'www.americansignaturefurniture.com/search/a/living-room/cabinets-storage/storage-ottomans' : 'f6bd26ccb2cb4d88b4d32212845bb45a',
    'www.americansignaturefurniture.com/living-room-furniture' : 'b08da4a6cf1a485c95d4ba15444faded',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/shop-all-custom-furniture' : '6b45e633bac54745a71b48e05738fabd',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/shop-for-upholstery' : '143f96969bfc4777bc88d5862f805b6d',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/shop-for-leather' : 'a1e72415a2ea4d92b06acc09c91eb9a3',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/shop-all-reclining-sofas' : '67f0c91f07d743fa8f72e1cc94f9dacd',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/shop-all-living-room' : '4f4c5114ee22403ebb95cfa987ec6d4a',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/see-whats-on-sale' : '5465f04bf7094dbd9212a62a8671b7cb',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/see-our-living-room-packages' : '6d3f1fdd0dac441c8d7389331fcafc99',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/see-our-best-sellers' : 'dcada0b504cf403d9de3b35f0b673b76',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/see-our-collections' : 'd15781ca827448309484ea96b2ed75be',
    'www.americansignaturefurniture.com/search/a/living-room/quick-links/shop-by-brands' : '3c19f143a7044f36819c89c5d8148e69',
    'www.americansignaturefurniture.com/search/a/living-room/seating/sofas' : '71e9e25230ac4710924b9bdae183e0e4',
    'www.americansignaturefurniture.com/search/a/living-room/seating/sectionals' : '113b9780d4e54f398771ecb16d2bfac3',
    'www.americansignaturefurniture.com/search/a/living-room/seating/loveseats' : '301ff8a3083f4a2eb63e3419292290e8',
    'www.americansignaturefurniture.com/search/a/living-room/seating/chairs-chaises' : '541240f2e10341f787fcde2daea1f712',
    'www.americansignaturefurniture.com/search/a/living-room/seating/sleeper-sofas' : '4c2a8679c3144195a63e9aff286dbaae',
    'www.americansignaturefurniture.com/search/a/living-room/seating/futons' : '50d0557a5ed54f39a1ed9236432ac79e',
    'www.americansignaturefurniture.com/search/a/living-room/seating/recliners-rockers' : '704a3f7bc8ba4521bb587778d0341642',
    'www.americansignaturefurniture.com/search/a/living-room/seating/ottomans' : 'ae470cf933ca4507b55d20723a1922f7',
    'www.americansignaturefurniture.com/search/a/living-room/seating/lift-chairs' : 'fcb2ceaeae9d4272adb3c2bcd6a3381b',
    'www.americansignaturefurniture.com/search/a/living-room/tables/coffee-tables' : '1c17b69814594afea5070b56579e5e7b',
    'www.americansignaturefurniture.com/search/a/living-room/tables/end-tables' : '7391d42dce4b40dca94ec78269e5e3da',
    'www.americansignaturefurniture.com/search/a/living-room/tables/sofa-tables' : 'a5390e3582334c5481307976d0922d7b',
    'www.americansignaturefurniture.com/search/a/made-to-mix/modern/all-modern-furniture' : '185f046abfe04d17a22808f54bad6eb5',
    'www.americansignaturefurniture.com/search/a/made-to-mix/modern/living-room' : '8fd48d26e0e54b1c88b2e31f82c03a69',
    'www.americansignaturefurniture.com/search/a/made-to-mix/modern/bedroom' : 'b246b802acd3486ab761734fb426cac0',
    'www.americansignaturefurniture.com/search/a/made-to-mix/modern/dining-room' : '5811a2b789cf45b1860fae02331a86ed',
    'www.americansignaturefurniture.com/search/a/made-to-mix/modern/accents' : 'cbd17ac8a61e4822b603ddb609150a8f',
    'www.americansignaturefurniture.com/search/a/made-to-mix/mix-living-room' : '3c39f147a3ad4299b148ff4e47098e0a',
    'www.americansignaturefurniture.com/search/a/made-to-mix/mix-bedroom' : '7aed011252644320870a6178bf55e8ad',
    'www.americansignaturefurniture.com/search/a/made-to-mix/mix-dining-room' : 'b69b16927f794dacbe3d156a37138099',
    'www.americansignaturefurniture.com/search/a/made-to-mix/mix-accents' : '39a3ca52f6b148099fd540d3dfb4503c',
    'www.americansignaturefurniture.com/made-to-mix' : '6e646ae1305d482784347ae910a2b0ed',
    'www.americansignaturefurniture.com/search/a/made-to-mix/traditional/all-traditional-furniture' : 'f6bb4c8e5d2541ebaf567666b7fceff0',
    'www.americansignaturefurniture.com/search/a/made-to-mix/traditional/living-room' : 'fb7df4b764c848de84fc48f4624e6980',
    'www.americansignaturefurniture.com/search/a/made-to-mix/traditional/bedroom' : 'b56b849d1a714a138726b6cac2e7c98b',
    'www.americansignaturefurniture.com/search/a/made-to-mix/traditional/dining-room' : '539fbe425d054308a2974468b97dc49a',
    'www.americansignaturefurniture.com/search/a/made-to-mix/traditional/accents' : 'de7dc0fe47c64285a844b213f757a419',
    'www.americansignaturefurniture.com/search/a/mattresses/accessories/bed-frames' : '5d3e66802fb84c9eb79c4e177d7a0294',
    'www.americansignaturefurniture.com/search/a/mattresses/accessories/bed-linens' : '9078098c15304080add2a5b5524ae3c3',
    'www.americansignaturefurniture.com/search/a/mattresses/accessories/pillows' : 'cbc5a9b302fd4c2cb684880d06e480cc',
    'www.americansignaturefurniture.com/search/a/mattresses/accessories/mattress-protectors' : '00e68a1e98ea4e14ac8e63b62c2dc25c',
    'www.americansignaturefurniture.com/search/a/mattresses/adjustable-bases-foundations' : '34c12f7c722840c4a756aab23a814862',
    'www.americansignaturefurniture.com/search/a/mattresses' : '73987677e68a430c81b010d35fd99b27',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/beautysleep' : 'fc5bdbe8b85746c3a0869d74a955a2b5',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/beautyrest' : '3ed6e649522140ca90b54d961c60035b',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/beautyrest-silver' : 'c5ea2db762434a4a916aa022582f36a0',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/beautyrest-platinum' : 'a017f19e2e214616be96b1d02b56e145',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/beautyrest-black' : '4e6e88bfc54743d48e8763744e591493',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/beautyrest-silver-hybrid' : '06ca9f350c034c85ab734177aa1d5434',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/icomfort-hybrid' : '15030c497dbe4fd7bd360f69c7c42f34',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/icomfort-foam' : '7f477e6d936743d29efedef21b327303',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/perfect-sleeper' : 'e22a04fb599b44478bd016ee0f53c670',
    'www.americansignaturefurniture.com/search/a/mattresses/brands/miraclefoam' : '0e969a7ef871486f8ea8bcb20bce786c',
    'www.americansignaturefurniture.com/search/a/mattresses/manufacturers/serta' : 'a54fbd06a5b04b55bc594e67abbb7dfb',
    'www.americansignaturefurniture.com/search/a/mattresses/manufacturers/simmons' : '9f8f7827890947b8911c0fe49e811ba4',
    'www.americansignaturefurniture.com/mattresses' : '07b0d78500114e2b8218dd67d154eecd',
    'www.americansignaturefurniture.com/search/a/mattresses/mattress-sets/twin-mattress-sets' : '0a4a532f1ec8468daeb0d3b8429971b4',
    'www.americansignaturefurniture.com/search/a/mattresses/mattress-sets/full-mattress-sets' : '4f059585d4d14398bef4252df6f3fccc',
    'www.americansignaturefurniture.com/search/a/mattresses/mattress-sets/queen-mattress-sets' : 'cb6acb825fb64e5f9899607dbbae0e3e',
    'www.americansignaturefurniture.com/search/a/mattresses/mattress-sets/king-mattress-sets' : 'a3386def0aca44698c56d8c609c8d881',
    'www.americansignaturefurniture.com/search/a/mattresses/adjustable-bases-foundations' : '4f22a664c9f34a19ab7acc0f55ffa77f',
    'www.americansignaturefurniture.com/search/a/mattresses/quick-links/shop-all-spring-mattresses' : 'f9d728446ee743fc8b5f93c4f85cdba7',
    'www.americansignaturefurniture.com/search/a/mattresses/quick-links/shop-all-hybrid-mattresses' : 'f2bf5a4418664753b56e037c03692c2c',
    'www.americansignaturefurniture.com/search/a/mattresses/quick-links/shop-all-foam-mattresses' : 'b2df0516685248c3a30643ebcefa1d37',
    'www.americansignaturefurniture.com/search/a/mattresses/quick-links/see-whats-on-sale' : '9f69212b1cc94f79b9c3f1b67e8f2fc4',
    'www.americansignaturefurniture.com/search/a/mattresses/quick-links/see-our-best-sellers' : '8484b50e7e644b24a429ad0c24a832bf',
    'www.americansignaturefurniture.com/search/a/mattresses/quick-links/see-our-collections' : '0b137927bac346d4aee57a6c3971f112',
    'www.americansignaturefurniture.com/search/a/new-arrivals' : '9a7d3ea4a01946608c0d213e484eb40d',
    'www.americansignaturefurniture.com/search/a/on-sale' : 'd038e95d725540f9b14e91dd46982b77',
    'www.americansignaturefurniture.com/personalized-living' : '72843fd0e0b74ac2a7a9821f4e7c9495',
    'www.americansignaturefurniture.com/privacy-policy' : '772743ed340f411586fb9e90d6368c1b',
    'www.americansignaturefurniture.com/recalls' : 'bf108367c4b6461ba22d2e60322f11e5',
    'www.americansignaturefurniture.com/refunds-exchanges' : 'da4b872fe34e4cf1bd417a36981b973c',
    'www.americansignaturefurniture.com/search/save/sale-items' : '392429f8539b414f8cd6bd3623f3d0b1',
    'www.americansignaturefurniture.com/shoppingcart' : '2b3bcf77d4e4494bac811a622b449e7a',
    'www.americansignaturefurniture.com/site-map' : '1adb40a91d2845fab275b113aa4ac99c',
    'www.americansignaturefurniture.com/store-locator' : '9ee13bec28614e9d844776afed85499e',
    'www.americansignaturefurniture.com/Telephone' : 'cd3fc48359bd4aff8ec2278f0f8ef75a',
    'www.americansignaturefurniture.com/terms-and-conditions' : '160a833bbb604feaa913bbd05f842c17',
    'www.americansignaturefurniture.com/track-my-order' : '87ac4203fac34f39a5ca415cf6d8b3ba',
    'www.americansignaturefurniture.com/ultimate-comfort' : '3ceadd94186c4069b20e49d214df91cc',
    'www.americansignaturefurniture.com/weeklyad' : '73b81230a7b74b1486dfb5d787901a74',
    'www.valuecityfurniture.com' : 'd7cfd132b4fb4856a03821772f65c83a',
    'www.valuecityfurniture.com/about-us' : '706d5f5b3b8144f5b0c449d1d08df347',
    'www.valuecityfurniture.com/search/a/accents/furniture/tv-stands-media-centers' : '5bbbb1de51d248d9a610c76160f91c93',
    'www.valuecityfurniture.com/search/a/accents/furniture/home-office' : '4c0d2ae21cef4215a311912753c9ed6f',
    'www.valuecityfurniture.com/search/a/accents/furniture/bookcases' : 'bde7bcac17354f74879b56384b35925b',
    'www.valuecityfurniture.com/search/a/accents/furniture/chairs' : '7f4e35f9254d43489667443eb55b5889',
    'www.valuecityfurniture.com/search/a/accents/furniture/ottomans' : '086ab52b0ab34e22a09c861798bf3b75',
    'www.valuecityfurniture.com/search/a/accents/furniture/fireplaces' : 'da74b6b9778545788a669f80b29a8136',
    'www.valuecityfurniture.com/search/a/accents/furniture/benches-settees' : '3d729674ab774634b2e8b87ef40d6041',
    'www.valuecityfurniture.com/search/a/accents/furniture/bars' : 'c740734cf66c4117bd77add1141d51c6',
    'www.valuecityfurniture.com/search/a/accents/furniture/accent-tables' : 'a6214656673547428a98e85788ccc6c2',
    'www.valuecityfurniture.com/search/a/accents/home-accessories/bed-linens' : 'f758e5cbd5f840baaea45193ede44436',
    'www.valuecityfurniture.com/search/a/accents/home-accessories/wall-art' : '91598dc8b8e946759cf19def08ca8892',
    'www.valuecityfurniture.com/search/a/accents/home-accessories/mirrors' : 'fd0b65350d9449118837b5785a532f57',
    'www.valuecityfurniture.com/search/a/accents/home-accessories/pillows' : '1dd7636eea244090abe9ac7bf3669eac',
    'www.valuecityfurniture.com/search/a/accents/home-accessories/lighting' : '3606d7f831854920b38fba6c59f74cc4',
    'www.valuecityfurniture.com/search/a/accents/home-accessories/rugs' : '3b67bc104dd74759b989b4dbb8877fcf',
    'www.valuecityfurniture.com/search/a/accents' : '286bbe2be7ed4f00af9fc623097a5175',
    'www.valuecityfurniture.com/search/a/accents/patio/outdoor-chairs' : '6463c1e9121c4934bba44101a6a2badd',
    'www.valuecityfurniture.com/search/a/accents/patio/outdoor-tables' : 'e08ae47781a74b069430583d3e677843',
    'www.valuecityfurniture.com/search/a/accents/patio/outdoor-dinettes' : 'e10da40896a04d00a979467213c45ef7',
    'www.valuecityfurniture.com/search/a/accents/patio/outdoor-sofas' : '8b46f080917f47d5b6eb1f6ee7f34ace',
    'www.valuecityfurniture.com/search/a/accents/patio/outdoor-sectionals' : '244bf47e10d74bb3bd8d3e1959ea4a01',
    'www.valuecityfurniture.com/search/a/accents/quick-links/shop-by-brand' : '81d6d2f0b25647f89a538cf504b6ee77',
    'www.valuecityfurniture.com/search/a/accents/quick-links/shop-all-accents' : '92bed247f1ad493b8439d9ba974ab579',
    'www.valuecityfurniture.com/search/a/accents/quick-links/shop-all-patio' : '23ff987690ad4397b94ea53d12ba59a7',
    'www.valuecityfurniture.com/search/a/accents/quick-links/see-our-best-sellers' : 'f5387fac23564b608ae75ddfcd7d4788',
    'www.valuecityfurniture.com/search/a/accents/quick-links/see-our-patio-packages' : '2c568a628c2443e8a1cf85e7afee4182',
    'www.valuecityfurniture.com/search/a/accents/quick-links/shop-all-free-shipping' : '2dda54619e5540dfbfbdb848207a63e5',
    'www.valuecityfurniture.com/account/register' : '37be6050abb54ef9be7d2a919a7281a7',
    'www.valuecityfurniture.com/account/sign-in' : 'b02e464925ed4736b85f466a03924c3b',
    'www.valuecityfurniture.com/account/wish-list' : '750c6b147e064506bcde98e41431ac31',
    'www.valuecityfurniture.com/account' : '37be6050abb54ef9be7d2a919a7281a7',
    'www.valuecityfurniture.com/search/a/bedroom/accents/pillows' : 'b6c037f0ab834c279294720acaecd571',
    'www.valuecityfurniture.com/search/a/bedroom/accents/bed-linens' : 'f7b67b626a9945efad9d4d96fe247071',
    'www.valuecityfurniture.com/search/a/bedroom/accents/lighting' : 'ffcbad0279564e2aa692fdc6fcf66665',
    'www.valuecityfurniture.com/search/a/bedroom/accents/wall-art' : 'fbf118b68aea47d0b87a02351e325133',
    'www.valuecityfurniture.com/search/a/bedroom/accents/mirrors' : '7a0a9b742ebe4af0b90bca7a6be0d749',
    'www.valuecityfurniture.com/search/a/bedroom/accents/rugs' : 'daeaf2bf57694277b3c1348734609a73',
    'www.valuecityfurniture.com/search/a/bedroom/accents/all-accent-pieces' : 'fed6e111bb2d4ba1af9f72dcf5595d09',
    'www.valuecityfurniture.com/search/a/bedroom/beds/twin-beds' : '01197648786f40bc8294f7f493917394',
    'www.valuecityfurniture.com/search/a/bedroom/beds/full-beds' : '3a8b41c676654d709de174ae468b9d47',
    'www.valuecityfurniture.com/search/a/bedroom/beds/queen-beds' : '70a8666b50c84ef7bd0c5bccbb759229',
    'www.valuecityfurniture.com/search/a/bedroom/beds/king-beds' : '380a7c20072d4b26848a79a90bf93c0b',
    'www.valuecityfurniture.com/search/a/bedroom/beds/daybeds' : '57b88005d5314d50b2d31049f73d30f1',
    'www.valuecityfurniture.com/search/a/bedroom/beds/futons' : '6e41bda7102c4c279820fdc0bedcd430',
    'www.valuecityfurniture.com/search/a/bedroom/beds/headboards' : 'c127f45708de4858a2006f47a2bdcfb9',
    'www.valuecityfurniture.com/search/a/bedroom/beds/bunk-beds-loft-beds' : '48fdb44443a248bd9794d804596b80a1',
    'www.valuecityfurniture.com/search/a/bedroom/cabinets-storage/dressers' : 'c183ea68ad5b4e6094c6d3fb9ca1f1fb',
    'www.valuecityfurniture.com/search/a/bedroom/cabinets-storage/chests' : 'f52e11e342294a409586532b103dc675',
    'www.valuecityfurniture.com/search/a/bedroom/cabinets-storage/nightstands' : 'c084235315bb4d5c951aa7aa866bf376',
    'www.valuecityfurniture.com/bedroom-furniture' : 'b42fb6a9d30c469f91855835e6b45f53',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/shop-by-brand' : 'fa8cf06de1914c79b1bdf8a92d677f78',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/shop-for-5-piece-bedrooms' : '2e2e1ac0e4f24f3bb3fa4dee6cd1f54b',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/shop-for-6-piece-bedrooms' : '1678b13f4ed94d9e9ce974dbd620a272',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/shop-all-bedroom' : 'a2f77bcc85a54fd5869a933617d6ee9c',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/see-whats-on-sale' : 'ae2348ed956f409f9bee06fef1c73eb3',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/see-our-bedroom-packages' : '9c9a8ab9b1844219bbfa38cfcd77bf9b',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/see-our-best-sellers' : 'f74fcf21e1474a579d32a8f501cde1d5',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/see-our-collections' : 'e4141c5efb644535a98e2dcb51e677a0',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/shop-all-kids' : '75a94ae752404f65a7d7dbc1e7cdcd8a',
    'www.valuecityfurniture.com/search/a/bedroom/quick-links/see-our-kids-collections' : '65f7f194d4d641cdbc661bfeb5dd66a5',
    'www.valuecityfurniture.com/search/a/bedroom/seating/benches-settees' : '969a64beffb942d581ef0766ee3406b9',
    'www.valuecityfurniture.com/search/a/bestsellers' : 'bf0b360ec7c045baaffabec4b67287d9',
    'www.valuecityfurniture.com/bestsellers.aspx' : 'd825084881d4402b9f80e21ec46371c3',
    'www.valuecityfurniture.com/blog' : '04b4e7c0aba14edcb7fa61ab79294dce',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/kroehler' : '51a03041fb024bcfa7a79d8448d9b058',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/nijarian' : 'f07544ad00184e24824277496222c177',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/pulaski' : 'd79b609df8594b708a2f0fd919576996',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/one80' : 'dcd3b46fe2354fdaa4edeef21a01f65d',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/apt-1710' : 'd72c10b0be3348ac9b248c88e228c43e',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/passport' : '7397ac0f2a62455e8811d2d8ee6d1cc9',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/vie-boutique' : '3cadabc6b96e4b5e9df8a1bcf28ed166',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/steve-silver' : 'b1adf1242715402eab74afbb1dc9d834',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/american-signature' : '7aaea97b9b7e44aba7c533751b8eb952',
    'www.valuecityfurniture.com/search/a/brands/our-furniture-brands/factory-outlet' : '880b42de187a4e47b54795a2d66f8a62',
    'www.valuecityfurniture.com/search/a/brands/our-mattress-brands/perfect-sleeper' : '7f29628991c249edad92aae9a512b8ef',
    'www.valuecityfurniture.com/search/a/brands/our-mattress-brands/iSeries' : '9d310ab3d3a841c4b4cdd6b7db901660',
    'www.valuecityfurniture.com/search/a/brands/our-mattress-brands/iComfort' : '85fae207310b4c91aee6b1789f9ac3da',
    'www.valuecityfurniture.com/search/a/brands/our-mattress-brands/miraclefoam' : '48791242f998431fa77b237d7915e93d',
    'www.valuecityfurniture.com/search/a/brands/our-mattress-brands/beautyrest' : 'd3c3d7c06e714e3a927f32f429c71da4',
    'www.valuecityfurniture.com/search/a/brands/our-mattress-brands/serta' : '6cbc744e52f1432a9faf842e77567d50',
    'www.valuecityfurniture.com/search/a/brands/our-mattress-brands/simmons' : '49ef72dae3924f2daf53a27ee2b53262',
    'www.valuecityfurniture.com/buying-guides' : '5b69a5894c2a4572accd4cc4e568b1e9',
    'www.valuecityfurniture.com/careers' : '4ab3be7e8914418f99380e024f040d4f',
    'www.valuecityfurniture.com/contact-us' : '22efd972464e45a3894faa41e612a706',
    'www.valuecityfurniture.com/search/a/dining-room/accents/lighting' : '3582091cf1874f1eb2c2e6c174c29cef',
    'www.valuecityfurniture.com/search/a/dining-room/accents/wall-art' : '18eb8dfbfe8e465da62a51935ea3116b',
    'www.valuecityfurniture.com/search/a/dining-room/accents/mirrors' : 'f2f2f2a995cd4036969d989f17565d16',
    'www.valuecityfurniture.com/search/a/dining-room/accents/bars' : '0d11661f85f74a0897273c51e97275b1',
    'www.valuecityfurniture.com/search/a/dining-room/accents/all-accent-pieces' : 'e26d8c37178046a1a0ae1a618606fd90',
    'www.valuecityfurniture.com/search/a/dining-room/cabinets-storage/buffets-sideboards' : 'a13b3f90d6c04bb0a094c372381a16ea',
    'www.valuecityfurniture.com/search/a/dining-room/cabinets-storage/china-cabinets-curios' : '53211a5bd5054275b36e9d0fca18ed01',
    'www.valuecityfurniture.com/dining-room-furniture' : '1c266fb24d4a4ce0b215c5f0a7cee51c',
    'www.valuecityfurniture.com/search/a/dining-room' : '1c266fb24d4a4ce0b215c5f0a7cee51c',
    'www.valuecityfurniture.com/search/a/dining-room/quick-links/shop-by-brand' : 'f7fce73f97524ba3ba0863aa95dcd5a2',
    'www.valuecityfurniture.com/search/a/dining-room/quick-links/shop-for-5-piece-dining-rooms' : '12b23646252b4d3c8fac976e549ba2cd',
    'www.valuecityfurniture.com/search/a/dining-room/quick-links/shop-for-7-piece-dining-rooms' : '18561fbe256a40b1b9c71774e549a98b',
    'www.valuecityfurniture.com/search/a/dining-room/quick-links/see-whats-on-sale' : '1e36069590c244ce9d4ee965a5019505',
    'www.valuecityfurniture.com/search/a/dining-room/quick-links/see-our-best-sellers' : 'c7a59ce322784c93bc2e90affefd4448',
    'www.valuecityfurniture.com/search/a/dining-room/quick-links/see-our-collections' : 'cd571540452d490abae591a1452fbeb1',
    'www.valuecityfurniture.com/search/a/dining-room/seating/dining-chairs' : '6067042cf7894ed6a94093cfb6381010',
    'www.valuecityfurniture.com/search/a/dining-room/seating/counter-bar-stools' : '598cadde4c48469faac66fc61b40e0e8',
    'www.valuecityfurniture.com/search/a/dining-room/seating/benches' : '8fbb6d63c5bc475a896f6a374d54457c',
    'www.valuecityfurniture.com/search/a/dining-room/tables/dining-tables' : 'bda8795d71e34411b4c0dabe7a453c3c',
    'www.valuecityfurniture.com/search/a/dining-room/tables/dinettes' : 'f44811347875422ea79976d2397bc694',
    'www.valuecityfurniture.com/easy-pass' : 'f3bc5c0c821444498b3b41a2569b825d',
    'www.valuecityfurniture.com/financing' : '82838ff26cef4be687f9fd5c25cbbc1e',
    'www.valuecityfurniture.com/frequently-asked-questions' : '376555dbb13245dbaeaa42a2077e6aee',
    'www.valuecityfurniture.com/giftcard' : '6965dba73fc849ec85ab19a36e55d5c3',
    'www.valuecityfurniture.com/home' : 'ed23217e3c544ab3ba30c82e894d2854',
    'www.valuecityfurniture.com/search/home-decor' : '58544aff58e44c7abb3f18ca1107f7db',
    'www.valuecityfurniture.com/search/a/inspiration/pinterest' : 'f5484656dd384b8da54320398a5d9e1d',
    'www.valuecityfurniture.com/is-new.aspx' : '1f3c18df2a2448fa83afea3fb4af153c',
    'www.valuecityfurniture.com/search/a/kids/beds/twin-beds' : 'f14c4ff8e882438d91829f5b771268cf',
    'www.valuecityfurniture.com/search/a/kids/beds/full-beds' : 'c1857c583fbc4f25a978e7dbf34b5a4b',
    'www.valuecityfurniture.com/search/a/kids/beds/bunk-beds-loft-beds' : '160b20df75d64e6599611a59ad4c7107',
    'www.valuecityfurniture.com/search/a/kids/cabinets-storage/dressers-chests' : '5cf8383c4e234692b76809d70e9e3a10',
    'www.valuecityfurniture.com/search/a/kids/cabinets-storage/nightstands' : 'eba61af1df4043e182a8eff3a2080e8d',
    'www.valuecityfurniture.com/search/a/kids/accents/bed-linens' : 'fefe0e4f49884dec9fdd96b8a4367003',
    'www.valuecityfurniture.com/search/a/kids/accents/chairs-chaises' : '1aaad81fc84444d79194efb569bdfbb3',
    'www.valuecityfurniture.com/search/a/kids/accents/lighting' : '4bd3897120334373a555c3892ea5a39e',
    'www.valuecityfurniture.com/search/a/kids/accents/all-accent-pieces' : '3235717bd4a34772b27739a11f5247c1',
    'www.valuecityfurniture.com/search/a/kids/quick-links/shop-by-brand' : '6bb0bbdae9464db1a85ad2da942a3aa3',
    'www.valuecityfurniture.com/search/a/kids/quick-links/shop-all-kids-furniture' : '2c3b596aba0f40958ab5f87d7c013089',
    'www.valuecityfurniture.com/search/a/kids/quick-links/see-whats-on-sale' : '58d87771c2fb4b15a4f2abc84431e97a',
    'www.valuecityfurniture.com/search/a/kids/quick-links/see-our-kids-furniture-packages' : 'fc9a509356624e2db026232b06f1fbb7',
    'www.valuecityfurniture.com/search/a/kids/quick-links/see-our-bestsellers' : '384e1f72ff4b4ed18769d3c4d1f162fa',
    'www.valuecityfurniture.com/search/a/kids/quick-links/see-our-collections' : 'abd136f43a774cc7acc069fb6680ba0f',
    'www.valuecityfurniture.com/search/a/living/cabinets-storage/accent-chests' : 'ae614f31cd5646629510de2f4502c780',
    'www.valuecityfurniture.com/search/a/living-room/accents/fireplaces' : 'b816f9c6b50944c585d7be2d4ae7c9ae',
    'www.valuecityfurniture.com/search/a/living-room/accents/rugs' : 'ce029ca9742b4f58b0a1473cd2831d92',
    'www.valuecityfurniture.com/search/a/living-room/accents/pillows' : '2d3f0413aff5482b94e811d1140909f3',
    'www.valuecityfurniture.com/search/a/living-room/accents/lighting' : '1299ba6e3ca94164a6bb34fbfa121a73',
    'www.valuecityfurniture.com/search/a/living-room/accents/wall-art' : '491a78e27bc547f2b269fd79ce50e8ed',
    'www.valuecityfurniture.com/search/a/living-room/accents/mirrors' : 'c2e19b6f32044a63ae85db06d4b28913',
    'www.valuecityfurniture.com/search/a/living-room/accents/all-accent-pieces' : '93face3e38874565bae16bcdb81a7013',
    'www.valuecityfurniture.com/search/a/living-room/cabinets-storage/tv-stands-media-centers' : 'd0885133669c45589416c7d6e0921567',
    'www.valuecityfurniture.com/search/a/living-room/cabinets-storage/bookcases' : 'f01eb73a330d47d1930941cefe517dd4',
    'www.valuecityfurniture.com/search/a/living-room/cabinets-storage/storage-ottomans' : '0374023d57eb4ae191b265458f4ed7b7',
    'www.valuecityfurniture.com/living-room-furniture' : '09bd769bd36b4bf2a560c5fed7703040',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/shop-all-custom-furniture' : 'ff6b572eda0e4e48bc92ade5b291f910',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/shop-for-upholstery' : '2b0bf11c63a646f0a01df265da48e71d',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/shop-for-leather' : 'c0e39e7ca360410392b5b123257e2451',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/shop-all-reclining-sofas' : '011d13115aad45a4980f28bb94c4c43c',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/shop-all-living-room' : '4bebed77b98d41b0a76b4ac89a23e54f',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/see-whats-on-sale' : 'dcee06ac27974331afea3c56c03907d9',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/see-our-living-room-packages' : 'eb4e7ec11ac348f49fdddccb368c2cd8',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/see-our-best-sellers' : 'a06fe8d9a06740878162601404a84f11',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/see-our-collections' : '98483ee507e44f5190a05d8e7b5e45c3',
    'www.valuecityfurniture.com/search/a/living-room/quick-links/shop-by-brands' : 'd04179cf6ba64c49870184a8047d0428',
    'www.valuecityfurniture.com/search/a/living-room/seating/sofas' : '9a1270e4c5944f9f93be0a0e4397c9a7',
    'www.valuecityfurniture.com/search/a/living-room/seating/sectionals' : '88e3b8689f194461a4e27806ea1b70b2',
    'www.valuecityfurniture.com/search/a/living-room/seating/loveseats' : '8e2be80ddb0a49dfa5a1a24dc0b1c653',
    'www.valuecityfurniture.com/search/a/living-room/seating/chairs-chaises' : '61c1292bbf6e4a98a1a3d40a8d5b224a',
    'www.valuecityfurniture.com/search/a/living-room/seating/sleeper-sofas' : 'a0cc18c6cc984abc9bb45ed254022ebf',
    'www.valuecityfurniture.com/search/a/living-room/seating/futons' : 'eba1fa1cbca547cea6c08517c48328fb',
    'www.valuecityfurniture.com/search/a/living-room/seating/recliners-rockers' : '2f73cd7503a541f79e852f7309290e44',
    'www.valuecityfurniture.com/search/a/living-room/seating/ottomans' : '6d54f44640f9411c99f7697e909e06aa',
    'www.valuecityfurniture.com/search/a/living-room/seating/lift-chairs' : '105597c00428416681f39e2bde296967',
    'www.valuecityfurniture.com/search/a/living-room/tables/coffee-tables' : '33a4544265fd44dcb1ebb5c7b3bee4c4',
    'www.valuecityfurniture.com/search/a/living-room/tables/end-tables' : '7ff7f5773e724ab5ab9046fc8a50ff3d',
    'www.valuecityfurniture.com/search/a/living-room/tables/sofa-tables' : '1de7beeaf39c43bebee626f45b287626',
    'www.valuecityfurniture.com/search/a/made-to-mix/modern/all-modern-furniture' : '4e6bb50eb8bb43a790dd2ad314bbb131',
    'www.valuecityfurniture.com/search/a/made-to-mix/modern/living-room' : '592bc8f557654a8babae041bdd38b161',
    'www.valuecityfurniture.com/search/a/made-to-mix/modern/bedroom' : '7e151ecbf58e4121a2cd1c0d85687dc2',
    'www.valuecityfurniture.com/search/a/made-to-mix/modern/dining-room' : '44a0335118a1442780e70d9920b65984',
    'www.valuecityfurniture.com/search/a/made-to-mix/modern/accents' : '90f71f3c2441402287c52fd664ee76c4',
    'www.valuecityfurniture.com/search/a/made-to-mix/mix-living-room' : '902d5555569a404399872d3e05934964',
    'www.valuecityfurniture.com/search/a/made-to-mix/mix-bedroom' : 'adeed01f0c5845d9b410d4335a553397',
    'www.valuecityfurniture.com/search/a/made-to-mix/mix-dining-room' : 'b3e86f6dad164d52bbe7e915d8f754d9',
    'www.valuecityfurniture.com/search/a/made-to-mix/mix-accents' : 'c1f2d903fe6a4a77a676aeaf89531114',
    'www.valuecityfurniture.com/made-to-mix' : 'ebb02998a1a3417e80fad7057f88c4b0',
    'www.valuecityfurniture.com/search/a/made-to-mix/traditional/all-traditional-furniture' : 'f430c97f552942aca42ab4f985cb02ba',
    'www.valuecityfurniture.com/search/a/made-to-mix/traditional/living-room' : '4b0121eeef6a49459bea37e4c17b4bd6',
    'www.valuecityfurniture.com/search/a/made-to-mix/traditional/bedroom' : 'cdb24868d5fd4139ba9a5a90fe936767',
    'www.valuecityfurniture.com/search/a/made-to-mix/traditional/dining-room' : '80f65be355124f51a03276d9f42189de',
    'www.valuecityfurniture.com/search/a/made-to-mix/traditional/accents' : '7dbc7ac5e4144580b527aca0bd9f7fd2',
    'www.valuecityfurniture.com/search/a/mattresses/accessories/bed-frames' : '12115a8fe6f04774865eb95e47383809',
    'www.valuecityfurniture.com/search/a/mattresses/accessories/bed-linens' : 'b916fcfb352341a1a5f4f519a7a3b706',
    'www.valuecityfurniture.com/search/a/mattresses/accessories/pillows' : '8dfb02d888604188b8dac9256f2d171b',
    'www.valuecityfurniture.com/search/a/mattresses/accessories/mattress-protectors' : '70b74910a8c5421f88bdb032da444f49',
    'www.valuecityfurniture.com/search/a/mattresses/adjustable-bases-foundations' : '94b711c39e9e4c15b93007b7797f07ab',
    'www.valuecityfurniture.com/search/a/mattresses/brands/beautysleep' : '6b5051df2c464bc8a5543420cc9c9cbb',
    'www.valuecityfurniture.com/search/a/mattresses/brands/beautyrest' : '8c5ee3ca09674a1e827301c40aace4c8',
    'www.valuecityfurniture.com/search/a/mattresses/brands/beautyrest-silver' : '08c2240775fa4bd8a9327bba2bd1fa7a',
    'www.valuecityfurniture.com/search/a/mattresses/brands/beautyrest-platinum' : '9446b4a1dc4149cfbdd4150fe4dd3f74',
    'www.valuecityfurniture.com/search/a/mattresses/brands/beautyrest-black' : '7558fefafc3c42b8aecf8f8bb1187011',
    'www.valuecityfurniture.com/search/a/mattresses/brands/beautyrest-silver-hybrid' : 'ef6bcfeef8084bd4b0c70f02bcfd7d77',
    'www.valuecityfurniture.com/search/a/mattresses/brands/icomfort-hybrid' : '7dcee7fc33524ac3972a7799fdb4d699',
    'www.valuecityfurniture.com/search/a/mattresses/brands/icomfort-foam' : '7459f4db1705436191afc040e8a8c96f',
    'www.valuecityfurniture.com/search/a/mattresses/brands/perfect-sleeper' : '1707518b207942e1aaba1db6324a950d',
    'www.valuecityfurniture.com/search/a/mattresses/brands/miraclefoam' : 'fa4b55e700954c8e995e86025cdb108e',
    'www.valuecityfurniture.com/search/a/mattresses/manufacturers/serta' : '38dadac6169c481c8147159802b79b6c',
    'www.valuecityfurniture.com/search/a/mattresses/manufacturers/simmons' : '1eeef54d6ce649e79eaba3e893bc16b2',
    'www.valuecityfurniture.com/mattresses' : 'fe006339c98b4ea3b53de2727ea2698e',
    'www.valuecityfurniture.com/search/a/mattresses' : 'd94182239f574d66937df075c6fcbdbd',
    'www.valuecityfurniture.com/search/a/mattresses/mattress-sets/twin-mattress-sets' : '588e6a3d6e9346fea3c72509099f6247',
    'www.valuecityfurniture.com/search/a/mattresses/mattress-sets/full-mattress-sets' : 'a6eeb9f4c4de4669bbd22b7767704210',
    'www.valuecityfurniture.com/search/a/mattresses/mattress-sets/queen-mattress-sets' : 'c3a13e8fd4cb4df2aef35cc24560c165',
    'www.valuecityfurniture.com/search/a/mattresses/mattress-sets/king-mattress-sets' : '8a926893e7524ad5ac7b96b98e51c55b',
    'www.valuecityfurniture.com/search/a/mattresses/adjustable-bases-foundations' : '1abcb6ab62af42789c1188f70557df1c',
    'www.valuecityfurniture.com/search/a/mattresses/quick-links/shop-all-spring-mattresses' : '643f6d29ccab4db294acaa40503a2564',
    'www.valuecityfurniture.com/search/a/mattresses/quick-links/shop-all-hybrid-mattresses' : '94ede1de1a1642a3a34570a9f2ec71f6',
    'www.valuecityfurniture.com/search/a/mattresses/quick-links/shop-all-foam-mattresses' : 'd53c3fa178194c57a5462d11850271eb',
    'www.valuecityfurniture.com/search/a/mattresses/quick-links/see-whats-on-sale' : 'be64a1b08db94febaed662ee5188b556',
    'www.valuecityfurniture.com/search/a/mattresses/quick-links/see-our-best-sellers' : 'c5f469d5ee1949a3bca67a5ff1bc7087',
    'www.valuecityfurniture.com/search/a/mattresses/quick-links/see-our-collections' : '457a77ddf84e4b58af940699afe109f2',
    'www.valuecityfurniture.com/search/a/new-arrivals' : 'abd64e5d3349450a99d0c6d0f398e731',
    'www.valuecityfurniture.com/search/a/on-sale' : 'b8ccdd4b2cce4447a8708adc417d8dc8',
    'www.valuecityfurniture.com/personalized-living' : 'f02455a8c1b4432a970450b27c039d4c',
    'www.valuecityfurniture.com/privacy-policy' : '6c8f8c00c49341d6bc3d47802c490ba4',
    'www.valuecityfurniture.com/recalls' : '01501220d51a4d6fba64f4479f70ba53',
    'www.valuecityfurniture.com/refunds-exchanges' : '26f27e6ecfe545548dddd0baca1758cf',
    'www.valuecityfurniture.com/search/save/sale-items' : '7ddeea6d111d4efebd439c7fa57fa08a',
    'www.valuecityfurniture.com/shoppingcart' : '4a47a1e03c9d47408146eeda159018a4',
    'www.valuecityfurniture.com/site-map' : '71bc62cccbd84c7e8b1d4ed6bf37c262',
    'www.valuecityfurniture.com/store-locator' : 'b3e1ae6028504e80b9506263e42c1d78',
    'www.valuecityfurniture.com/Telephone' : '61f2db8a957c4463bb6d7ad69f3c4e43',
    'www.valuecityfurniture.com/terms-and-conditions' : 'c73f106413dc49d58b429293c828c826',
    'www.valuecityfurniture.com/track-my-order' : '3e6d1f7cb8fb44c482390c517732fec4',
    'www.valuecityfurniture.com/ultimate-comfort' : 'efb3d0638a3f4144a3433bab416a9773',
    'www.valuecityfurniture.com/weeklyad' : '4ceb0821944e48c4a0a88dafe50d3292',
    'www.americansignaturefurniture.com/checkout/thankyou' : 'a78b277c331c4b348dbccd051376e2ce',
    'www.valuecityfurniture.com/checkout/thankyou' : 'f7238e98e32848b9aef2ddb4d814262e',
    'www.americansignaturefurniture.com/designer-looks-value-prices' : '230e9a138b7d4e8bb2083f651d360030',
    'www.americansignaturefurniture.com/search/a/designer-looks/living-room-furniture' : 'e0b8fb196c3f45c49b4b304ee986a0ec',
    'www.americansignaturefurniture.com/search/a/designer-looks/dining-room-furniture' : 'a6546d996124487da4acb69dc35f6b2a',
    'www.americansignaturefurniture.com/search/a/designer-looks/bedroom-furniture' : 'a88480ec6c3a49168a3304758f87fdb6',
    'www.valuecityfurniture.com/designer-looks-value-prices' : 'feb875517b02412d9d8d316753ecc312',
    'www.valuecityfurniture.com/search/v/designer-looks/living-room-furniture' : '3aed39c54f5c4db190e9d89e51ca5e45',
    'www.valuecityfurniture.com/search/v/designer-looks/dining-room-furniture' : '236c45269a804b89ac0024c7e728cd72',
    'www.valuecityfurniture.com/search/v/designer-looks/bedroom-furniture' : 'a83103b731824e8d985f7c6d799ec8b8'
  };

  // Each key is an array of strings.  If the current URL contains all of these strings,
  // then the value pixel will fire
  var urlSubstringMap = {
    'americansignature' : 'bb73044fbfab4ad79b95804544e558a4',
    'americansignature,checkout' : 'f8523adb3b1e4cf99441b74c1e65076b',
    'valuecity' : '25b19bd12c404b78bc5f72ad76ba3c7a',
    'valuecity,checkout' : '0b122710aaf24fe098a3e1b45e12793e'
  };

  dxUpx();

})();