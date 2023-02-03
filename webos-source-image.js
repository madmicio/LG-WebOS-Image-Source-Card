class WebOsSource extends HTMLElement {
    setConfig(config) {
    this._config = config;
    }
    set hass(hass) {
    this._hass = hass;
    this.entityId = this._config.entity;
    this.entity = this._hass.states[this.entityId];
    this.render();
    }
    render() {
        let encodedFileName;
        if (this.entity.state === "on") {
            if (this.entity.attributes.media_title) {
                encodedFileName = encodeURIComponent(this.entity.attributes.media_title);
            } else if (this.entity.attributes.source) {
                if (this._config.hdmi_list) {
                    for (let hdmi of this._config.hdmi_list) {
                        if (hdmi.hdmi === this.entity.attributes.source) {
                            let mediaplayerId = hdmi.mediaplayer;
                            let mediaplayer = this._hass.states[mediaplayerId];
                            encodedFileName = encodeURIComponent(mediaplayer.attributes.source);
                            break;
                        }
                    }
                }
                if (!encodedFileName) {
                    encodedFileName = encodeURIComponent(this.entity.attributes.source);
                }
            }
        } else if (this._config.hdmi_list) {
            for (let hdmi of this._config.hdmi_list) {
                let mediaplayerId = hdmi.mediaplayer;
                let mediaplayer = this._hass.states[mediaplayerId];
                if (mediaplayer.state === "on") {
                    encodedFileName = encodeURIComponent(mediaplayer.attributes.source);
                    break;
                }
            }
        }
        if (!encodedFileName) {
            encodedFileName = "tv_off";
        }
    
        this.innerHTML = `
            <style>
                .image-container {
                    padding-top: 56.34%;
                    background-size: cover;
                    background-position: center;
                    transform: scale(0.7);
                }
            </style>
            <div class="image-container" style="background-image: url(/local/lg_remote/tv_logo/${encodedFileName}.png)"></div>
        `;
    }
    
}

customElements.define("webos-source-image", WebOsSource);