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
            if (feature.geometry.type === 'MultiLineString' || feature.geometry.type === 'LineString') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFHcmlkc0xheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTGFHcmlkc0xheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsQ0FBQyxDQXlGVjtBQXpGRCxXQUFVLENBQUM7SUFNUCxNQUFhLFdBQVksU0FBUSxDQUFDLENBQUMsWUFBWTtRQU0zQyxZQUFZLE1BQWdCLEVBQUUsV0FBMkIsRUFBRSxPQUE0QjtZQUNuRixLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ3BDLENBQUM7UUFDUSxLQUFLLENBQUMsR0FBRztZQUNkLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUIsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELFdBQVc7WUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTztZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQUUsT0FBTztZQUMvRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQUUsT0FBTztZQUV6RSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7WUFDL0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixN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