require("./page-title.css").toString();

class PageTitle {
  // To add tool to toolbox
  //   static get toolbox() {
  //     return {
  //       title: "Page Title",
  //       icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
  //     };
  //   }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    // this.block.selected = false;
    this._CSS = {
      block: this.api.styles.block,
    };

    this._settings = config;
    this._data = this.normalizeData(data);
    this._element = this.getTag();
  }

  normalizeData(data) {
    const newData = {};

    if (typeof data !== "object") {
      data = {};
    }

    newData.text = data.text || "";

    return newData;
  }

  render() {
    return this._element;
  }

  validate(blockData) {
    return blockData.text.trim() !== "";
  }

  save(toolsContent) {
    return {
      text: toolsContent.innerHTML,
    };
  }

  static get conversionConfig() {
    return {
      export: "text",
      import: "text",
    };
  }

  static get sanitize() {
    return {
      text: {},
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  get data() {
    this._data.text = this._element.innerHTML;

    return this._data;
  }

  set data(data) {
    this._data = this.normalizeData(data);

    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || "";
    }
  }

  getTag() {
    const tag = document.createElement("h1");
    tag.setAttribute("id", "page-title");

    /**
     * Add text to block
     */
    tag.innerHTML = this._data.text || "";

    /**
     * Make tag editable
     */
    tag.contentEditable = this.readOnly ? "false" : "true";

    /**
     * Add Placeholder
     */
    // tag.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || "");
    tag.dataset.placeholder = this.api.i18n.t(
      this._settings.placeholder || "Untitled"
    );

    return tag;
  }

  onPaste(event) {
    const content = event.detail.data;

    this.data = {
      text: content.innerHTML,
    };
  }
}

export default PageTitle;
