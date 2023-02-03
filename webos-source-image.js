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
            .card {
                background: var(--ha-card-background, var(--card-background-color, white) );
                border-radius: var(--ha-card-border-radius, 4px);
                box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) );
                color: var(--primary-text-color);
                display: block;
                transition: all .3s ease-out 0s;
                position: relative;
                padding-top: 10px;
                filter: saturate(var(--color_saturation));
            }
                .image-container {
                    padding-top: 56.34%;
                    background-size: cover;
                    background-position: center;
                    transform: scale(0.7);
                }
            </style>
            <div class="card">
            <div class="image-container" style="background-image: url(/local/lg_remote/tv_logo/${encodedFileName}.png)"></div>
            </div>
        `;
    }
    
}

customElements.define("webos-source-image", WebOsSource);
