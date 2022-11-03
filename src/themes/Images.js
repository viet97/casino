const TYPE_IMAGE = {
  JPG: '.jpg',
  PNG: '.png',
  GIF: '.gif',
};

const DEFINE_REQUIRE = {
  back: {
    source: require('../../assets/images/back.png'),
    type: TYPE_IMAGE.PNG,
  },
  default: {
    source: require('../../assets/images/default.png'),
    type: TYPE_IMAGE.PNG,
  },
  ic_search: {
    source: require('../../assets/images/ic_search.png'),
    type: TYPE_IMAGE.PNG,
  },
  close: {
    source: require('../../assets/images/close.png'),
    type: TYPE_IMAGE.PNG,
  },
  filter: {
    source: require('../../assets/images/filter.png'),
    type: TYPE_IMAGE.PNG,
  },
  search: {
    source: require('../../assets/images/search.png'),
    type: TYPE_IMAGE.PNG,
  },
  setting_logo: {
    source: require('../../assets/images/setting_logo.png'),
    type: TYPE_IMAGE.PNG,
  },
  inventory_logo: {
    source: require('../../assets/images/inventory_logo.png'),
    type: TYPE_IMAGE.PNG,
  },
  top_cover: {
    source: require('../../assets/images/top_cover.gif'),
    type: TYPE_IMAGE.PNG,
  },
  history_cover: {
    source: require('../../assets/images/history_cover.gif'),
    type: TYPE_IMAGE.PNG,
  },
  item_cover: {
    source: require('../../assets/images/item_cover.png'),
    type: TYPE_IMAGE.PNG,
  },
  create_game_bg: {
    source: require('../../assets/images/create_game_bg.png'),
    type: TYPE_IMAGE.PNG,
  },
  start_game_cover: {
    source: require('../../assets/images/start_game_cover.png'),
    type: TYPE_IMAGE.PNG,
  },
  create_cover: {
    source: require('../../assets/images/create_cover.gif'),
    type: TYPE_IMAGE.PNG,
  },
  home_cover: {
    source: require('../../assets/images/home_cover.gif'),
    type: TYPE_IMAGE.PNG,
  },
  loading: {
    source: require('../../assets/images/loading.gif'),
    type: TYPE_IMAGE.PNG,
  },
  splash: {
    source: require('../../assets/images/splash.gif'),
    type: TYPE_IMAGE.PNG,
  },
};

export const Images = {
  assets: {
    ...DEFINE_REQUIRE,
  },
};
