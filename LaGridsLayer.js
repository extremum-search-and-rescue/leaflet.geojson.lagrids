(function (factory) {
    // Packaging/modules magic dance
    var L;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        // Node/CommonJS
        L = require('leaflet');
        module.exports = factory(L);
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw new Error('Leaflet must be loaded first');
        }
        factory(window.L);
    }
})(function (L) {

    const CanvasLabel = L.CircleMarker.extend({
        onAdd: function (map) {
            L.CircleMarker.prototype.onAdd.call(this, map);
            this._map = map;
        },
        _updatePath: function () {
            if (!this._map) return;
            if (!this._renderer._bounds.intersects(this._pxBounds)) return;

            const currentZoom = this._map.getZoom();
            if (currentZoom <= this.options.minZoom || currentZoom >= this.options.maxZoom) return;

            const theme = this._map.options.baseLayerTheme;
            const p = this._point.round();
            const mainColor = theme === 'dark' ? 'white' : 'red';
            const shadowColor = theme === 'dark' ? 'black' : 'white';

            this._renderer._ctx.fillStyle = shadowColor;
            this._renderer._ctx.fillText(this.feature.properties.name, p.x + 5, p.y + 13);

            this._renderer._ctx.fillStyle = mainColor;
            this._renderer._ctx.fillText(this.feature.properties.name, p.x+4, p.y+12);
        }
    });
    L.canvasLabel = function (latlng, options) {
        return new CanvasLabel(latlng, options);
    }
    const LaGridsLayer = L.GeoJsonLayer.extend({
        options: {
            refreshIntervalSeconds: 600,
            style: function (feature) {
            }
        },
        onEachFeature: function (feature, layer) {
            if (feature.geometry.type === 'MultiLineString' || feature.geometry.type === 'LineString')
            {
                layer.options.color = map.options.baseLayerTheme === 'dark' ? 'white' : 'red';
                layer.options.interactive = false;
                layer.options.lineJoin = 'miter';
                layer.options.lineCap = 'square';
                layer.options.weight = 1;
            }
        },
        pointToLayer: function (feature, latlng) {
            const label = L.canvasLabel(latlng, { minZoom: 13, interactive: false});
            label.feature = feature;
            return label.addTo(map);
        },
        redraw: function () {
            setTimeout(()=> this.setStyle(this.options.style),0);
        },
        style: function (feature) {
            const retval = {}; 
            if (feature.geometry.type === 'MultiLineString' || feature.geometry.type === 'LineString') { 
                retval.color = map.options.baseLayerTheme === 'dark' ? 'white' : 'red'
            }
            return retval;
        }
    });

    L.laGridsLayer = function(url, options){
        return new LaGridsLayer(url, options);
    }
});