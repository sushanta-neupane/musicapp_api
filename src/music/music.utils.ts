export const availablePlatform = {
  saavn: 'Jio Saavn',
  yt: 'Youtube ',
  shazam: 'Shazam'
};

export const PLAYLIST_IDS = {
  hit_list: 'RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJFs',
  bollyhood_hits: 'RDCLAK5uy_n9Fbdw7e6ap-98_A-8JYBmPv64v-Uaq1g',
  released: 'RDCLAK5uy_ksEjgm3H_7zOJ_RHzRjN1wY-_FFcs7aAU',
  global100: 'PL4fGSI1pDJn6puJdseH2Rt9sMvt9E2M4i',
  caribbean_pulse: 'RDCLAK5uy_kUFCSc-grF3m-L_49W6p1QyGsMbueEbog',
  conducted: 'RDCLAK5uy_lbQ87tFQihzaDxmmfDoHbw5xQwBWUrMDk',
  kpop: 'RDCLAK5uy_l7wbVbkC-dG5fyEQQsBfjm_z3dLAhYyvo'
};

const base_filters = ['trending', 'charts', 'albums', 'playlists'];

export const music_filters = [...base_filters, ...Object.keys(PLAYLIST_IDS)];
