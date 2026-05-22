export type GalleryPhoto = {
  id: string
  src: string
  srcSet: string
  thumb: string
  alt: string
  ratio?: "portrait" | "landscape" | "square"
}

export type GalleryVideo = {
  id: string
  src: string
  poster: string
  title: string
}

const CLD_BASE = "https://res.cloudinary.com/dq5tsivzq/image/upload"

function img(version: string, file: string, ratio: GalleryPhoto["ratio"] = "landscape"): GalleryPhoto {
  const url = (w: number) => `${CLD_BASE}/f_auto,q_auto,w_${w}/${version}/${file}`
  const id = file.replace(/\.[^.]+$/, "")
  const alt = id.replace(/_/g, " ")
  return {
    id,
    alt,
    ratio,
    src: url(1200),
    srcSet: `${url(480)} 480w, ${url(800)} 800w, ${url(1200)} 1200w, ${url(1800)} 1800w`,
    thumb: url(400),
  }
}

/* CAPTURES — daily / IMG style (6) */
export const photosCaptures: GalleryPhoto[] = [
  img("v1779425270", "15_2026-02-10_17_22_53.868_26805463352047_IMG_0012.jpg_mas6dk.jpg", "portrait"),
  img("v1779425271", "15_2026-02-14_14_18_37.286_14515910277691_IMG_0359.jpg_yr3yfv.jpg", "portrait"),
  img("v1779425271", "15_2026-02-10_17_23_02.458_26814053997116_IMG_0093.jpg_gmwn8u.jpg", "portrait"),
  img("v1779426334", "15_2026-01-07_12_59_03.533_2049978196638415_IMG_1242.jpg_b0xwpa.jpg", "portrait"),
  img("v1779426353", "15_2026-02-16_20_27_28.588_36864578792751_IMG_2436.jpg_opxtvn.jpg", "portrait"),
  img("v1779426355", "15_2026-02-19_13_56_29.614_14300206213821_IMG_2854.jpg_j0tcam.jpg", "portrait"),
]

/* STUDIO SESSIONS — DSC + BEL (6) */
export const photosStudio: GalleryPhoto[] = [
  img("v1779426331", "15_2026-01-06_15_17_22.000_1971876662921576_DSC_9672.jpg_i2kcez.jpg", "portrait"),
  img("v1779426340", "15_2026-01-09_12_34_15.691_2221290354477326_DSC_1644.jpg_ktmgdf.jpg", "portrait"),
  img("v1779426334", "15_2026-01-10_12_50_52.749_2308687412746706_BEL_0258.jpg_zyp9rl.jpg", "portrait"),
  img("v1779426336", "15_2026-01-19_16_48_39.193_23683181258640_BEL_0725.jpg_xz2xjc.jpg", "portrait"),
  img("v1779426339", "15_2026-01-19_16_48_56.970_23700959132756_BEL_0826.jpg_kldxlz.jpg", "portrait"),
  img("v1779426341", "15_2026-01-19_16_51_40.041_23864029981453_BEL_1047.jpg_swi3l4.jpg", "portrait"),
]

/* GUA SERIES — long editorial (22) */
export const photosEditorial: GalleryPhoto[] = [
  img("v1779425274", "GUA_4496_hgrnw7.jpg"),
  img("v1779425405", "GUA_4570_ie4vs9.jpg"),
  img("v1779425405", "GUA_4593_g7yopz.jpg"),
  img("v1779425406", "GUA_4651_z1wkw8.jpg"),
  img("v1779425407", "GUA_4718_gwpah8.jpg"),
  img("v1779425409", "GUA_4842_c0crrz.jpg"),
  img("v1779425632", "GUA_4923_a8tyxs.jpg"),
  img("v1779425634", "GUA_5003_uwyp95.jpg"),
  img("v1779425635", "GUA_5167_umgf2d.jpg"),
  img("v1779425648", "GUA_5279_jswl8w.jpg"),
  img("v1779425650", "GUA_5374_bn57nl.jpg"),
  img("v1779425654", "GUA_5419_pwutcm.jpg"),
  img("v1779426341", "15_2026-01-26_15_40_35.110_16443076747652_GUA_0016.jpg_jikwji.jpg"),
  img("v1779426343", "15_2026-01-29_14_46_35.740_17034729119474_GUA_0050.jpg_wucyav.jpg"),
  img("v1779426344", "15_2026-02-07_16_14_55.829_21517795614105_GUA_0791.jpg_vqm4xn.jpg"),
  img("v1779426361", "15_2026-02-22_12_52_18.571_10258560807992_GUA_1557.jpg_yhyl9o.jpg"),
  img("v1779426361", "15_2026-02-22_12_52_22.329_10262318210984_GUA_1595.jpg_t5rcyi.jpg"),
  img("v1779426363", "15_2026-02-22_12_52_27.165_10267153969590_GUA_1640.jpg_qcxez8.jpg"),
  img("v1779426371", "15_2026-02-22_12_52_34.771_10274760428313_GUA_1718.jpg_uro4ml.jpg"),
  img("v1779426373", "15_2026-02-22_12_52_41.959_10281948442922_GUA_1787.jpg_gei3mc.jpg"),
  img("v1779426374", "15_2026-02-22_12_52_46.732_10286721583824_GUA_1834.jpg_b7bxwj.jpg"),
  img("v1779426379", "15_2026-02-22_12_52_48.307_10288296280691_GUA_1863.jpg_afvpdh.jpg"),
]

export const allPhotos: GalleryPhoto[] = [
  ...photosCaptures,
  ...photosStudio,
  ...photosEditorial,
]

const CLD_VIDEO = "https://res.cloudinary.com/dq5tsivzq/video/upload"

function video(version: string, file: string, title: string): GalleryVideo {
  return {
    id: file.replace(/\.[^.]+$/, ""),
    title,
    src: `${CLD_VIDEO}/f_auto,q_auto/${version}/${file}`,
    poster: `${CLD_VIDEO}/f_jpg,so_1,w_1200/${version}/${file.replace(/\.(mov|mp4)$/i, ".jpg")}`,
  }
}

export const motionPieces: GalleryVideo[] = [
  video("v1779425791", "bucle.0_t7sh0f.mov", "Bucle"),
  video("v1779425870", "PainZoneAffterlogo_z9tssl.mp4", "Pain Zone — After Logo"),
  video("v1779425918", "movieout.2_fkfwiv.mov", "Movie Out"),
]

export const heroPhotos: GalleryPhoto[] = [
  photosStudio[3],
  photosEditorial[5],
  photosEditorial[18],
  photosCaptures[0],
  photosStudio[4],
]
