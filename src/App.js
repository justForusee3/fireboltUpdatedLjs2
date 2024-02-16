import { Lightning, Utils, Log } from "@lightningjs/sdk";
import { Device } from "@firebolt-js/sdk";
import { List } from "@lightningjs/ui";
import { MyButton } from "./MyButton";
import Poster from "./components/poster";
import Swimlane from "./components/Swimlane";

export class App extends Lightning.Component {
  static getFonts() {
    return [
      { family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
    ];
  }

  static _template() {
    return {
      HelloWorld: {
        w: 1920,
        h: 1080,
        y: 0,
        rect: true,
        // color: 0xff000000,
        src: Utils.asset("images/pp.png"),

        FireboltStatus: {
          Rdklogo: {
            x: 70,
            y: 50,
            w: 300,
            h: 65,
            zIndex: 10,
            // shadowColor: 0xffff00ff,
            src: Utils.asset("images/RDK-Logo-web.webp"),
          },
          Alexalogo: {
            x: 1050,
            y: 5,
            w: 170,
            h: 150,
            src: Utils.asset("images/alexa.png"),
          },

          Trailer: {
            x: 120,
            y: 385,
            w: 100,
            h: 100,
            //color: 0xffff00ff,
            src: Utils.asset("images/facebook.png"),
          },

          Watchparty: {
            x: 480,
            y: 385,
            w: 90,
            h: 90,

            src: Utils.asset("images/share.png"),
          },

          Bookmark: {
            x: 300,
            y: 385,
            w: 100,
            h: 90,
            src: Utils.asset("images/bookmark.png"),
          },

          Info: {
            x: 650,
            y: 380,
            w: 100,
            h: 100,
            src: Utils.asset("images/info.png"),
          },

          Belllogo: {
            x: 1285,
            y: 30,
            w: 90,
            h: 90,
            src: Utils.asset("images/sett.png"),
          },
          Notifilogo: {
            x: 1450,
            y: 30,
            w: 100,
            h: 100,
            src: Utils.asset("images/noti.png"),
          },
          CurrentTime: {
            mountX: 0.5,
            x: 1700,
            y: 40,
            w: 200,
            h: 100, // Adjust the Y position as needed
            text: {
              text: "",
              fontFace: "Regular",
              fontSize: 70,
              //textColor: 0xff09f676,
            },
          },

          Device: {
            mountX: 0.5,
            x: 960,
            y: 1030,
            text: {
              // text: "Device not Ready!",
              fontFace: "Regular",
              fontSize: 24,
              //textColor: 0xff09f676,
            },
          },
        },
        Playbutton: {
          type: MyButton,
          mount: -0.2,
          x: 115,
          y: 130,
          text: {
            //text: "Recent",
            fontFace: "Regular",
            fontSize: 45,
            textColor: 0xffffffff,
          },
          signals: {
            onClick: "$onItemSelect",
          },
        },
      },
      List: { x: 90, y: 550, w: 800, h: 350, type: List, direction: "column" },
      VideoSection: {
        alpha: 1,
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        color: "0xff000000",
        rect: true,
        visible: false,
        HelpMsg: {
          x: 80,
          y: 50,
          w: 1920,
          text: {
            text: "Play the Video using AAMP Player",
            fontSize: 40,
            fontFace: "Regular",
            textAlign: "center",
            lineHeight: 50,
          },
          color: "0xffffffff",
          alpha: 1,
        },
        Video: {
          x: 0,
          y: 0,
          w: 1920, // Set to your desired width
          h: 1080, // Set to your desired height
          type: Lightning.components.VideoItem, // Use the appropriate Lightning video
        },
      },
    };
  }

  _getFocused() {
    return this.tag("List");
  }
  _init() {
    this.index = 0;

    // Fetch data from the JSON file
    this.url = Utils.asset("data/data.json");

    // Fetch the data and create buttons
    fetch(this.url)
      .then((response) => response.json())
      .then((data) => {
        this.dataLength = data.length; // Set dataLength based on the length of the data array
        this.setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle exceptions or perform additional actions here
      });
    this._updateCurrentTime();

    // Update the time every second (1000 milliseconds)
    setInterval(() => {
      this._updateCurrentTime();
    }, 1000);
  }

  setItems(data) {
    const lanes = [];
    for (let i = 0; i < 1; i++) {
      let items = data.map((item, i) => ({
        w: 264,
        h: 374,
        type: Poster,
        imageUrl: Utils.asset(item.src),
        argument: {
          item: item,
        },
      }));

      lanes.push({
        margin: 15,
        w: 1820,
        h: 374 + 100,
        type: Swimlane,
        argument: {
          itemSize: { w: 264, h: 374 },
          title: "Featured Video on Demand",
        },
        items: items,
      });
    }
    this.tag("List").add(lanes);
  }

  // $onItemSelect(obj) {
  //   const url =
  //     "https://media.axprod.net/TestVectors/v9-MultiFormat/Clear/Manifest_1080p.m3u8";
  //   this._player = new AAMPMediaPlayer();
  //   this._player.load(url);
  //   this._setState("VideoPlay");
  // }

  $onItemSelect(obj) {
    console.log("Selected Item Object:", obj);

    const selectedItem = obj.item; // Assuming the selected item has a 'videoUrl' property in your data.json
    console.log("videourl:: " + selectedItem.videoUrl);
    if (selectedItem && selectedItem.videoUrl) {
      const url = selectedItem.videoUrl;
      this._player = new AAMPMediaPlayer();
      this._player.load(url);
      this._setState("VideoPlay");
    } else {
      console.error("Selected item does not have a valid videoUrl.");
    }
  }

  _updateCurrentTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    this.tag("CurrentTime").text.text = `${formattedTime}`;
  }

  _handleLeft() {
    this.index = (this.index - 1 + this.dataLength) % this.dataLength;
  }

  _handleRight() {
    this.index = (this.index + 1) % this.dataLength;
  }

  static _states() {
    return [
      class LaunchView extends this {
        _getFocused() {
          return this.tag("List");
        }
      },
      class VideoPlay extends this {
        _getFocused() {
          return this.tag("Video");
        }
        $enter() {
          this.tag("Video").visible = true;
          this.tag("HelloWorld").visible = false;
          this.tag("List").visible = false;
        }
        _handleBack() {
          console.log("back to launchView");
          this.tag("Video").visible = false;

          this.tag("HelloWorld").visible = true;
          this.tag("List").visible = true;

          this._setState("LaunchView");
          if (this._player) {
            this._player.stop();
            this._player = null;
          }
        }
      },
    ];
  }

  _active() {
    console.log("active set state to launchView");
    this._setState("LaunchView");

    Device.version().then((version) => {
      const deviceVersion =
        "version:" +
        version.sdk.readable +
        " : v" +
        version.sdk.major +
        "." +
        version.sdk.minor +
        "." +
        version.sdk.patch;
      Log.info(deviceVersion);
      this.tag("Device").text.text += deviceVersion;
    });
  }
}
