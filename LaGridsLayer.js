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
            const mainColor = theme === 'dark' ? 'white' : 'red';
            const shadowColor = theme === 'dark' ? 'black' : 'white';
            this._renderer._ctx.fillStyle = shadowColor;
            this._renderer._ctx.fillText(this.feature.properties.name, p.x + 5, p.y + 13);
            this._renderer._ctx.fillStyle = mainColor;
            this._renderer._ctx.fillText(this.feature.properties.name, p.x + 4, p.y + 12);
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
                layer.options.color = parentLayer._map.options.baseLayerTheme === 'dark' ? 'white' : 'red';
                layer.options.interactive = false;
                layer.options.lineJoin = 'miter';
                layer.options.lineCap = 'square';
                layer.options.weight = 1;
            }
        }
        pointToLayer(feature, latlng) {
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
                retval.color = map.options.baseLayerTheme === 'dark' ? 'white' : 'red';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFHcmlkc0xheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTGFHcmlkc0xheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsQ0FBQyxDQXlGVjtBQXpGRCxXQUFVLENBQUM7SUFNUCxNQUFhLFdBQVksU0FBUSxDQUFDLENBQUMsWUFBWTtRQU0zQyxZQUFZLE1BQWdCLEVBQUUsV0FBMkIsRUFBRSxPQUE0QjtZQUNuRixLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ3BDLENBQUM7UUFDUSxLQUFLLENBQUMsR0FBVTtZQUNyQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxXQUFXO1lBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO2dCQUFFLE9BQU87WUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUFFLE9BQU87WUFDL0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN4QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUFFLE9BQU87WUFFekUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIs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