var L;
(function (L) {
    class CanvasLabel extends L.CircleMarker {
        constructor(latlng, parentLayer, options) {
            super(latlng, options);
            this._parentLayer = parentLayer;
        }
        onAdd(map) {
            super.onAdd(map);
            this._map = map;
            this._map.getRenderer(this);
            return this;
        }
        _updatePath() {
            if (!this._map)
                return;
            if (!this._renderer._bounds.intersects(this._pxBounds))
                return;
            const currentZoom = this._map.getZoom();
            if (this.options.minZoom && (currentZoom < this.options.minZoom))
                return;
            const theme = this._map.options.baseLayerTheme;
            const p = this._point.round();
            const mainColor = theme === 'dark' ? 'white' : 'black';
            const backgroundColor = theme === 'dark'
                ? getComputedStyle(this._renderer._ctx.canvas).getPropertyValue("--gray950")
                : getComputedStyle(this._renderer._ctx.canvas).getPropertyValue("--yellow50");
            const ctx = this._renderer._ctx;
            ctx.font = "900 11px Helvetica Neue, Segoe UI, Tahoma, sans-serif";
            let metrics = ctx.measureText(this.feature.properties.name);
            let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(p.x - metrics.width / 2 - 2, p.y - 1 - actualHeight / 2, Math.ceil(metrics.width + 2), Math.ceil(actualHeight) + 2);
            ctx.fillStyle = mainColor;
            ctx.fillText(this.feature.properties.name, p.x - metrics.width / 2, p.y + actualHeight / 2);
        }
    }
    L.CanvasLabel = CanvasLabel;
    function canvasLabel(latlng, parentLayer, options) {
        return new L.CanvasLabel(latlng, parentLayer, options);
    }
    L.canvasLabel = canvasLabel;
    class LaGridsLayerOptions {
        constructor() {
            this.refreshIntervalSeconds = 600;
            this.style = L.LaGridsLayer.style;
            this.onEachFeature = L.LaGridsLayer.onEachFeature;
        }
    }
    L.LaGridsLayerOptions = LaGridsLayerOptions;
    class LaGridsLayer extends L.GeoJsonLayer {
        constructor(url, options) {
            options = Object.assign(Object.assign({}, new L.LaGridsLayerOptions()), options);
            super(url, options);
        }
        static onEachFeature(feature, layer, parentLayer) {
            if (layer instanceof L.Polyline) {
                const color = parentLayer._map
                    && parentLayer._map.options
                    && parentLayer._map.options.baseLayerTheme === 'dark'
                    ? 'white'
                    : 'black';
                layer.options.color = color;
                layer.options.interactive = false;
                layer.options.lineJoin = 'miter';
                layer.options.lineCap = 'square';
                layer.options.weight = 1;
            }
        }
        pointToLayer(feature, latlng) {
            if (!this._map) {
                console.error("Error adding LA grid label to canvas. Wrong context:", this);
            }
            ;
            const label = L.canvasLabel(latlng, this, { minZoom: 13, interactive: false });
            label.feature = feature;
            return label.addTo(this._map);
        }
        redraw() {
            setTimeout(() => this.setStyle(this.options.style), 0);
            return this;
        }
        static style(feature) {
            const retval = {};
            if (feature.geometry.type === 'MultiLineString' || feature.geometry.type === 'LineString') {
                retval.color = map.options.baseLayerTheme === 'dark' ? 'white' : 'black';
            }
            return retval;
        }
    }
    L.LaGridsLayer = LaGridsLayer;
    function laGridsLayer(url, options) {
        return new L.LaGridsLayer(url, options);
    }
    L.laGridsLayer = laGridsLayer;
})(L || (L = {}));
//# sourceMappingURL=LaGridsLayer.js.map