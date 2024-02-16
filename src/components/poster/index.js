import { Lightning, Colors } from "@lightningjs/sdk";

export default class Poster extends Lightning.Component {
  static _template() {
    return {
      ImageWrapper: {
        w: (w) => w,
        h: (h) => h,
        rtt: true,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 },
        Fill: {
          w: (w) => w,
          h: (h) => h,
          color: Colors("black").lighter(0.5).get(),
          rect: true,
        },
      },
      Image: {
        alpha: 0.001,
        mount: 0.5,
        w: (w) => w,
        h: (h) => h,
        resizeMode: {
          type: "contain",
          w: (w) => w,
          h: (h) => h,
        },
        y: (w) => w / 2,
        x: (h) => h / 2,
        src: this.bindProp("imageUrl"),
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 },
      },
      Focus: {
        alpha: 0,
        x: 0,
        y: 0,
        w: (w) => w,
        h: (h) => h,
        rect: true,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 3,
          stroke: 5,
          strokeColor: Colors("0xff009d9a").get(),
          blend: 1,
          fillColor: Colors("black").alpha(0).get(),
        },
      },
    };
  }

  _init() {
    this._item = this.nullishCoalesc(this.argument && this.argument.item);
    const image = this.tag("Image");
    image.on("txLoaded", () => {
      image.setSmooth("alpha", 1);
    });

    const focus = this.tag("Focus");
    focus.patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 16,
        stroke: 5,
        strokeColor: Colors("green").get(),
        blend: 1,
        fillColor: Colors("black").alpha(0).get(),
      },
    });
  }

  nullishCoalesc(...values) {
    for (const value of values) {
      if (value !== null && value !== undefined) return value;
    }
  }

  _focus() {
    this.tag("Focus").patch({ alpha: 1 });
  }

  _unfocus() {
    this.tag("Focus").patch({ alpha: 0 });
  }
  _handleEnter() {
    this.fireAncestors("$onItemSelect", {
      item: this._item,
    });
  }
}
