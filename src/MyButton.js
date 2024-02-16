import { Lightning } from "@lightningjs/sdk";

export class MyButton extends Lightning.Component {
  static _template() {
    return {
      w: 250,
      h: 350,

      y: 100,
      Image: {
        x: 5,
        w: (w) => w,
        h: (h) => h - 50,
      },
    };
  }

  _init() {
    this.label = this.argument && this.argument.label;
    this.src = this.argument && this.argument.src;
    this.videoUrl = this.argument && this.argument.videoUrl;
    //this.item = this.argument && this.argument.item;
    // Access the item property to get the videoUrl
    // const videoUrl = this.item && this.item.videoUrl ? this.item.videoUrl : null;

    // Check if videoUrl is valid
    if (this.videoUrl) {
      // Load the video or perform any other actions
      console.log(`Clicked Video URL: ${this.videoUrl}`);
      // ... rest of the code
    } else {
      console.log(`Selected item does not have a valid videoUrl.`);
    }
  }
  get item() {
    return this.item;
  }

  set item(obj) {
    console.log("Item MyButton.js");
    const { label, src, videoUrl } = obj;
    this._videoUrl = videoUrl;
    this.patch({
      Image: { src },
    });
  }

  setFocus(isFocused) {
    if (isFocused) {
      this._focus();
    } else {
      this._unfocus();
    }
  }

  _handleEnter(e) {
    // Log the videoUrl before firing the event
    console.log("_handleEnter Clicked Video URL:", this.videoUrl);

    // Fire the event
    this.fireAncestors("$onItemSelect", {
      videoUrl: this.videoUrl,
    });
  }

  _focus() {
    console.log("Button Focus");
    this.patch({
      smooth: { color: 0xff005500, scale: 1.1 },
      shader: {
        type: Lightning.shaders.Outline,
        stroke: 1.1,
        color: 0xff09f676,
      },
    });
  }

  _unfocus() {
    console.log("Button Unfocus");
    this.patch({
      smooth: { color: 0xffffffff, scale: 1.0 },
      shader: { type: Lightning.shaders.Outline, stroke: 0, color: 0x0000000 },
    });
  }
}
