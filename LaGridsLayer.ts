namespace L { 
    export interface CanvasLabelOptions {
        interactive?: boolean;
        minZoom?: number;
        maxZoom?: number;
    }
    export class CanvasLabel extends L.CircleMarker {
        private _parentLayer: L.GeoJsonLayer
        private _renderer: L.Canvas;
        private _point: L.Point
        private _pxBounds: any;
        override options: CanvasLabelOptions
        constructor(latlng: L.LatLng, parentLayer: L.GeoJsonLayer, options?: CanvasLabelOptions) {
            super(latlng, options);
            this._parentLayer = parentLayer;
        }
        override onAdd(map: L.Map): this {
            super.onAdd(map);
            this._map = map;
            this._map.getRenderer(this);
            return this;
        }
        _updatePath () {
            if (!this._map) return;
            if (!this._renderer._bounds.intersects(this._pxBounds)) return;
            const currentZoom = this._map.getZoom();
            if (this.options.minZoom && (currentZoom < this.options.minZoom)) return;

            

            const theme = this._map.options.baseLayerTheme;
            const p = this._point.round();
            const mainColor = theme === 'dark' ? 'white' : 'black';
            const backgroundColor = theme === 'dark'
                ? getComputedStyle(this._renderer._ctx.canvas).getPropertyValue("--gray950")
                : getComputedStyle(this._renderer._ctx.canvas).getPropertyValue("--yellow50");
            const ctx = this._renderer._ctx;

            ctx.font = "900 11px Helvetica Neue, Segoe UI, Tahoma, sans-serif"
            let metrics = ctx.measureText(this.feature.properties.name);
            let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(p.x - metrics.width / 2 - 2, p.y - 1 - actualHeight / 2, Math.ceil(metrics.width + 2), Math.ceil(actualHeight) + 2 )

            ctx.fillStyle = mainColor;
            ctx.fillText(this.feature.properties.name, p.x - metrics.width / 2, p.y + actualHeight / 2);
        }
    }

    export function canvasLabel(latlng: L.LatLng, parentLayer: L.GeoJsonLayer, options: any) {
        return new L.CanvasLabel(latlng, parentLayer, options);
    }
    export interface LaGridsLayerOptions extends L.GeoJsonLayerOptions {

    }
    export class LaGridsLayerOptions implements L.LaGridsLayerOptions {
        refreshIntervalSeconds?: number = 600
        style?: StyleFunction<any> = L.LaGridsLayer.style
        onEachFeature? = L.LaGridsLayer.onEachFeature
    }
    export class LaGridsLayer extends L.GeoJsonLayer {
        override options: LaGridsLayerOptions
        constructor(url: string, options: L.LaGridsLayerOptions) {
            options = {...new L.LaGridsLayerOptions(), ...options}
            super(url, options);
        }
        static onEachFeature(feature: GeoJSON.Feature, layer: L.Polyline | L.Marker, parentLayer: L.LaGridsLayer): void {
            if (layer instanceof L.Polyline)
            {
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
        pointToLayer(feature: GeoJSON.Feature<GeoJSON.Point, any>, latlng: L.LatLng) {
            if (!this._map) {
                console.error("Error adding LA grid label to canvas. Wrong context:", this);
            };
            const label = L.canvasLabel(latlng, this, { minZoom: 13, interactive: false});
            label.feature = feature;
            return label.addTo(this._map);
        }
        override redraw (): this {
            setTimeout(() => this.setStyle(this.options.style), 0);
            return this;
        }
        static style (feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>): L.PathOptions {
            const retval: PathOptions = {}; 
            if (feature.geometry.type === 'MultiLineString' || feature.geometry.type === 'LineString') { 
                retval.color = map.options.baseLayerTheme === 'dark' ? 'white' : 'black'
            }
            return retval;
        }
    }

    export function laGridsLayer (url: string, options: L.LaGridsLayerOptions){
        return new L.LaGridsLayer(url, options);
    }
}