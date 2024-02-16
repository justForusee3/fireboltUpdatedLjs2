import { Lightning, Colors } from "@lightningjs/sdk";
import { List } from "@lightningjs/ui";

export default class Swimlane extends Lightning.Component {
  static _template() {
    return {
      Container: {
        x: 0,
        y: 0,
        w: 1920,
        h: 700,
        Title: {
          x: 0,
          y: 0,
          w: 1740,
          text: {
            text: "Rail Title",
          },
        },
        List: {
          x: 0,
          y: 70,
          w: 1820,
          h: 0,
          type: List,
          direction: "row",
          signals: {
            onIndexChanged: true,
            $childInactive: true,
          },
        },
      },
    };
  }

  _init() {
    this._itemSize = (this.argument && this.argument.itemSize) || {
      w: 264,
      h: 148,
    };
    this._marginBelowTitle =
      (this.argument && this.argument.marginBelowTitle) || 16;
    this._textConfig =
      (this.argument && this.argument.size) || Swimlane.textConfig;
    this._title = (this.argument && this.argument.title) || "";
    // this._items = this.items
    this._draw();
  }

  set items(items) {
    this._items = items;
    this._draw();
  }

  get items() {
    return this._items;
  }

  _getFocused() {
    return this.tag("List");
  }

  _focus() {
    this.tag("Title").patch({
      text: {
        fontStyle: "bold",
      },
    });
  }

  _unfocus() {
    this.tag("Title").patch({
      text: {
        fontStyle: "normal",
      },
    });
  }

  onIndexChanged(data) {
    const { previousIndex } = data;
  }

  _draw() {
    if (this._itemSize) {
      this.tag("List").h = this._itemSize.h;
      this.tag("Title").patch({
        text: {
          text: this._title,
          fontFace: this._textConfig.fontFace || Swimlane.textConfig.fontFace,
          fontSize: this._textConfig.fontSize || Swimlane.textConfig.fontSize,
          fontStyle:
            this._textConfig.fontStyle || Swimlane.textConfig.fontStyle,
          textAlign:
            this._textConfig.textAlign || Swimlane.textConfig.textAlign,
          wordWrap: this._textConfig.wordWrap || Swimlane.textConfig.wordWrap,
          textColor:
            this._textConfig.textColor || Swimlane.textConfig.textColor,
          wordWrapWidth:
            this._textConfig.wordWrapWidth || Swimlane.textConfig.wordWrapWidth,
          paddingLeft:
            this._textConfig.paddingLeft || Swimlane.textConfig.paddingLeft,
          paddingRight:
            this._textConfig.paddingRight || Swimlane.textConfig.paddingRight,
        },
      });
      this.tag("Title").on("txLoaded", () => {
        this.patch({
          h:
            this.tag("Title").text._source.h +
            this._marginBelowTitle +
            this._itemSize.h,
        });
      });

      if (this._items) {
        this.tag("List").add(
          this._items.map((item, index) => ({
            margin: 16,
            marginLeft: index === 0 ? -1 : 16,
            ...item,
          }))
        );
      }
    }
  }
}

Swimlane.textConfig = {
  fontFace: "Regular",
  fontSize: 40,
  fontStyle: "bold",
  textAlign: "left",
  wordWrap: true,
  textColor: Colors("white").darker(0.5).get(),
  wordWrapWidth: 0,
  paddingLeft: 0,
  paddingRight: 0,
};
