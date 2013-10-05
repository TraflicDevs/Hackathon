/*! Esri-Leaflet - v0.0.1 - 2013-09-17
 *   Copyright (c) 2013 Environmental Systems Research Institute, Inc.
 *   Apache License*/
! function (a, b) {
    "object" == typeof module && "object" == typeof module.exports && (exports = module.exports = b()), "object" == typeof window && (a.Terraformer = b())
}(this, function () {
    function a() {
        var a = Array.prototype.slice.apply(arguments);
        void 0 !== typeof console && console.warn && console.warn.apply(console, a)
    }

    function b(a, b) {
        for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
        return a
    }

    function c(a) {
        switch (a.type) {
        case "Point":
            return [a.coordinates[0], a.coordinates[1], a.coordinates[0], a.coordinates[1]];
        case "MultiPoint":
            return f(a.coordinates);
        case "LineString":
            return f(a.coordinates);
        case "MultiLineString":
            return d(a.coordinates);
        case "Polygon":
            return d(a.coordinates);
        case "MultiPolygon":
            return e(a.coordinates);
        case "Feature":
            return c(a.geometry);
        case "FeatureCollection":
            return g(a);
        case "GeometryCollection":
            return h(a);
        default:
            throw new Error("Unknown type: " + a.type)
        }
    }

    function d(a) {
        for (var b = null, c = null, d = null, e = null, f = 0; f < a.length; f++)
            for (var g = a[f], h = 0; h < g.length; h++) {
                var i = g[h],
                    j = i[0],
                    k = i[1];
                null === b ? b = j : b > j && (b = j), null === c ? c = j : j > c && (c = j), null === d ? d = k : d > k && (d = k), null === e ? e = k : k > e && (e = k)
            }
        return [b, d, c, e]
    }

    function e(a) {
        for (var b = null, c = null, d = null, e = null, f = 0; f < a.length; f++)
            for (var g = a[f], h = 0; h < g.length; h++)
                for (var i = g[h], j = 0; j < i.length; j++) {
                    var k = i[j],
                        l = k[0],
                        m = k[1];
                    null === b ? b = l : b > l && (b = l), null === c ? c = l : l > c && (c = l), null === d ? d = m : d > m && (d = m), null === e ? e = m : m > e && (e = m)
                }
        return [b, d, c, e]
    }

    function f(a) {
        for (var b = null, c = null, d = null, e = null, f = 0; f < a.length; f++) {
            var g = a[f],
                h = g[0],
                i = g[1];
            null === b ? b = h : b > h && (b = h), null === c ? c = h : h > c && (c = h), null === d ? d = i : d > i && (d = i), null === e ? e = i : i > e && (e = i)
        }
        return [b, d, c, e]
    }

    function g(a) {
        for (var b, d = [], e = a.features.length - 1; e >= 0; e--) b = c(a.features[e].geometry), d.push([b[0], b[1]]), d.push([b[2], b[3]]);
        return f(d)
    }

    function h(a) {
        for (var b, d = [], e = a.geometries.length - 1; e >= 0; e--) b = c(a.geometries[e]), d.push([b[0], b[1]]), d.push([b[2], b[3]]);
        return f(d)
    }

    function i(a) {
        var b = c(a);
        return {
            x: b[0],
            y: b[1],
            w: Math.abs(b[0] - b[2]),
            h: Math.abs(b[1] - b[3])
        }
    }

    function k(a) {
        return a * Y
    }

    function l(a) {
        return a * Z
    }

    function m(a, b) {
        for (var c = 0; c < a.length; c++) "number" == typeof a[c][0] && (a[c] = b(a[c])), "object" == typeof a[c] && (a[c] = m(a[c], b));
        return a
    }

    function n(a) {
        var b = a[0],
            c = a[1];
        return [k(b / X) - 360 * Math.floor((k(b / X) + 180) / 360), k(Math.PI / 2 - 2 * Math.atan(Math.exp(-1 * c / X)))]
    }

    function o(a) {
        var b = a[0],
            c = Math.max(Math.min(a[1], 89.99999), -89.99999);
        return [l(b) * X, X / 2 * Math.log((1 + Math.sin(l(c))) / (1 - Math.sin(l(c))))]
    }

    function p(a, b, c) {
        if ("Point" === a.type) a.coordinates = b(a.coordinates);
        else if ("Feature" === a.type) a.geometry = p(a.geometry, b, !0);
        else if ("FeatureCollection" === a.type)
            for (var d = 0; d < a.features.length; d++) a.features[d] = p(a.features[d], b, !0);
        else if ("GeometryCollection" === a.type)
            for (var e = 0; e < a.geometries.length; e++) a.geometries[e] = p(a.geometries[e], b, !0);
        else a.coordinates = m(a.coordinates, b);
        return c || b === o && (a.crs = $), b === n && delete a.crs, a
    }

    function q(a) {
        return p(a, o)
    }

    function r(a) {
        return p(a, n)
    }

    function s(a, b) {
        return b > a ? -1 : a > b ? 1 : 0
    }

    function t(a, b) {
        return a[0] - b[0] > a[1] - b[1] ? 1 : a[0] - b[0] < a[1] - b[1] ? -1 : 0
    }

    function u(a, b, c) {
        return s((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]), 0)
    }

    function v(a, b) {
        var c = b[0] - a[0],
            d = b[1] - a[1];
        return c * c + d * d
    }

    function w(a, b) {
        var c = b;
        for (var d in a) {
            var e = u(b, c, a[d]);
            (-1 === e || 0 === e && v(b, a[d]) > v(b, c)) && (c = a[d])
        }
        return c
    }

    function x(a) {
        if (0 === a.length) return [];
        if (1 === a.length) return a;
        for (var b = [a.sort(t)[0]], c = 0; c < b.length; c++) {
            var d = w(a, b[c]);
            d !== b[0] && b.push(d)
        }
        return b
    }

    function y(a, b) {
        for (var c = !1, d = -1, e = a.length, f = e - 1; ++d < e; f = d)(a[d][1] <= b[1] && b[1] < a[f][1] || a[f][1] <= b[1] && b[1] < a[d][1]) && b[0] < (a[f][0] - a[d][0]) * (b[1] - a[d][1]) / (a[f][1] - a[d][1]) + a[d][0] && (c = !c);
        return c
    }

    function z(a, b) {
        if (a && a.length) {
            if (1 === a.length) return y(a[0], b);
            if (y(a[0], b)) {
                for (var c = 1; c < a.length; c++)
                    if (y(a[c], b)) return !1;
                return !0
            }
            return !1
        }
        return !1
    }

    function A(a, b, c, d) {
        var e = (d[0] - c[0]) * (a[1] - c[1]) - (d[1] - c[1]) * (a[0] - c[0]),
            f = (b[0] - a[0]) * (a[1] - c[1]) - (b[1] - a[1]) * (a[0] - c[0]),
            g = (d[1] - c[1]) * (b[0] - a[0]) - (d[0] - c[0]) * (b[1] - a[1]);
        if (0 !== g) {
            var h = e / g,
                i = f / g;
            if (h >= 0 && 1 >= h && i >= 0 && 1 >= i) return !0
        }
        return !1
    }

    function B(a, b) {
        for (var c = 0; c < a.length - 1; c++)
            for (var d = 0; d < b.length - 1; d++)
                if (A(a[c], a[c + 1], b[d], b[d + 1])) return !0;
        return !1
    }

    function C(a, b) {
        for (var c = 0; c < b.length; c++)
            for (var d = b[c], e = 0; e < d.length - 1; e++)
                for (var f = 0; f < a.length - 1; f++)
                    if (A(d[e], d[e + 1], a[f], a[f + 1])) return !0;
        return !1
    }

    function D(a, b) {
        for (var c = 0; c < a.length; c++)
            if (C(a[c], b)) return !0;
        return !1
    }

    function E(a, b) {
        for (var c = 0; c < b.length; c++) return C(a, b[c]) ? !0 : !1
    }

    function F(a, b) {
        for (var c = 0; c < a.length; c++) return E(a[c], b) ? !0 : !1
    }

    function G(a, b) {
        for (var c = 0; c < a.length; c++) return F(a[c], b) ? !0 : !1
    }

    function H(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c].slice();
            I(d[0], d[d.length - 1]) === !1 && d.push(d[0]), b.push(d)
        }
        return b
    }

    function I(a, b) {
        for (var c = 0; c < a.length; c++)
            for (var d = 0; d < b.length; d++)
                if (a[c] !== b[d]) return !1;
        return !0
    }

    function J(a, b) {
        if (a.length !== b.length) return !1;
        for (var c = a.slice().sort(t), d = b.slice().sort(t), e = 0; e < c.length; e++) {
            if (c[e].length !== d[e].length) return !1;
            for (var f = 0; f < c.length; f++)
                if (c[e][f] !== d[e][f]) return !1
        }
        return !0
    }

    function K(a) {
        if (a) switch (a.type) {
        case "Point":
            return new L(a);
        case "MultiPoint":
            return new M(a);
        case "LineString":
            return new N(a);
        case "MultiLineString":
            return new O(a);
        case "Polygon":
            return new P(a);
        case "MultiPolygon":
            return new Q(a);
        case "Feature":
            return new R(a);
        case "FeatureCollection":
            return new S(a);
        case "GeometryCollection":
            return new T(a);
        default:
            throw new Error("Unknown type: " + a.type)
        }
    }

    function L(a) {
        var c = Array.prototype.slice.call(arguments);
        if (a && "Point" === a.type && a.coordinates) b(this, a);
        else if (a && "[object Array]" === Object.prototype.toString.call(a)) this.coordinates = a;
        else {
            if (!(c.length >= 2)) throw "Terraformer: invalid input for Terraformer.Point";
            this.coordinates = c
        }
        this.type = "Point"
    }

    function M(a) {
        if (a && "MultiPoint" === a.type && a.coordinates) b(this, a);
        else {
            if (!Array.isArray(a)) throw "Terraformer: invalid input for Terraformer.MultiPoint";
            this.coordinates = a
        }
        this.type = "MultiPoint"
    }

    function N(a) {
        if (a && "LineString" === a.type && a.coordinates) b(this, a);
        else {
            if (!Array.isArray(a)) throw "Terraformer: invalid input for Terraformer.LineString";
            this.coordinates = a
        }
        this.type = "LineString"
    }

    function O(a) {
        if (a && "MultiLineString" === a.type && a.coordinates) b(this, a);
        else {
            if (!Array.isArray(a)) throw "Terraformer: invalid input for Terraformer.MultiLineString";
            this.coordinates = a
        }
        this.type = "MultiLineString"
    }

    function P(a) {
        if (a && "Polygon" === a.type && a.coordinates) b(this, a);
        else {
            if (!Array.isArray(a)) throw "Terraformer: invalid input for Terraformer.Polygon";
            this.coordinates = a
        }
        this.type = "Polygon"
    }

    function Q(a) {
        if (a && "MultiPolygon" === a.type && a.coordinates) b(this, a);
        else {
            if (!Array.isArray(a)) throw "Terraformer: invalid input for Terraformer.MultiPolygon";
            this.coordinates = a
        }
        this.type = "MultiPolygon"
    }

    function R(a) {
        if (a && "Feature" === a.type && a.geometry) b(this, a);
        else {
            if (!(a && a.type && a.coordinates)) throw "Terraformer: invalid input for Terraformer.Feature";
            this.geometry = a
        }
        this.type = "Feature"
    }

    function S(a) {
        if (a && "FeatureCollection" === a.type && a.features) b(this, a);
        else {
            if (!Array.isArray(a)) throw "Terraformer: invalid input for Terraformer.FeatureCollection";
            this.features = a
        }
        this.type = "FeatureCollection"
    }

    function T(a) {
        if (a && "GeometryCollection" === a.type && a.geometries) b(this, a);
        else if (Array.isArray(a)) this.geometries = a;
        else {
            if (!a.coordinates || !a.type) throw "Terraformer: invalid input for Terraformer.GeometryCollection";
            this.type = "GeometryCollection", this.geometries = [a]
        }
        this.type = "GeometryCollection"
    }

    function U(a, b, c) {
        for (var d = o(a), e = c || 64, f = {
                type: "Polygon",
                coordinates: [
                    []
                ]
            }, g = 1; e >= g; g++) {
            var h = g * (360 / e) * Math.PI / 180;
            f.coordinates[0].push([d[0] + b * Math.cos(h), d[1] + b * Math.sin(h)])
        }
        return r(f)
    }

    function V(a, c, d) {
        var e = d || 64,
            f = c || 250;
        if (!a || a.length < 2 || !f || !e) throw new Error("Terraformer: missing parameter for Terraformer.Circle");
        b(this, new R({
            type: "Feature",
            geometry: U(a, f, e),
            properties: {
                radius: f,
                center: a,
                steps: e
            }
        }))
    }
    var W = {}, X = 6378137,
        Y = 57.29577951308232,
        Z = .017453292519943,
        $ = {
            type: "link",
            properties: {
                href: "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
                type: "ogcwkt"
            }
        }, _ = {
            type: "link",
            properties: {
                href: "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
                type: "ogcwkt"
            }
        }, ab = ["length"];
    return K.prototype.toMercator = function () {
        return q(this)
    }, K.prototype.toGeographic = function () {
        return r(this)
    }, K.prototype.envelope = function () {
        return i(this)
    }, K.prototype.bbox = function () {
        return c(this)
    }, K.prototype.convexHull = function () {
        var a, b, c = [];
        if ("Point" === this.type) return this.coordinates && this.coordinates.length > 0 ? [this.coordinates] : [];
        if ("LineString" === this.type || "MultiPoint" === this.type) {
            if (!(this.coordinates && this.coordinates.length > 0)) return [];
            c = this.coordinates
        } else if ("Polygon" === this.type || "MultiLineString" === this.type) {
            if (!(this.coordinates && this.coordinates.length > 0)) return [];
            for (a = 0; a < this.coordinates.length; a++) c = c.concat(this.coordinates[a])
        } else {
            if ("MultiPolygon" !== this.type) throw new Error("Unable to get convex hull of " + this.type);
            if (!(this.coordinates && this.coordinates.length > 0)) return [];
            for (a = 0; a < this.coordinates.length; a++)
                for (b = 0; b < this.coordinates[a].length; b++) c = c.concat(this.coordinates[a][b])
        }
        return x(c)
    }, K.prototype.toJSON = function () {
        var a = {};
        for (var b in this) this.hasOwnProperty(b) && -1 === ab.indexOf(b) && (a[b] = this[b]);
        return a.bbox = c(this), a
    }, K.prototype.within = function (a) {
        var b, c, d;
        if ("Point" === a.type && "Point" === this.type) return I(this.coordinates, a.coordinates);
        if ("MultiLineString" === a.type && "Point" === this.type)
            for (c = 0; c < a.coordinates.length; c++) {
                var e = {
                    type: "LineString",
                    coordinates: a.coordinates[c]
                };
                if (this.within(e)) return !0
            }
        if (("LineString" === a.type || "MultiPoint" === a.type) && "Point" === this.type)
            for (c = 0; c < a.coordinates.length; c++) {
                if (this.coordinates.length !== a.coordinates[c].length) return !1;
                if (I(this.coordinates, a.coordinates[c])) return !0
            }
        if ("Polygon" === a.type) {
            if ("Polygon" === this.type) {
                if (a.coordinates.length === this.coordinates.length)
                    for (c = 0; c < this.coordinates.length; c++)
                        if (J(this.coordinates[c], a.coordinates[c])) return !0;
                return this.coordinates.length && z(a.coordinates, this.coordinates[0][0]) ? !D(H(this.coordinates), H(a.coordinates)) : !1
            }
            if ("Point" === this.type) return z(a.coordinates, this.coordinates);
            if ("LineString" === this.type || "MultiPoint" === this.type) {
                if (!this.coordinates || 0 === this.coordinates.length) return !1;
                for (c = 0; c < this.coordinates.length; c++)
                    if (z(a.coordinates, this.coordinates[c]) === !1) return !1;
                return !0
            }
            if ("MultiLineString" === this.type) {
                for (c = 0; c < this.coordinates.length; c++) {
                    var f = new N(this.coordinates[c]);
                    if (f.within(a) === !1) return d++, !1
                }
                return !0
            }
            if ("MultiPolygon" === this.type) {
                for (c = 0; c < this.coordinates.length; c++) {
                    var g = new K({
                        type: "Polygon",
                        coordinates: this.coordinates[c]
                    });
                    if (g.within(a) === !1) return !1
                }
                return !0
            }
        }
        if ("MultiPolygon" === a.type) {
            if ("Point" === this.type) {
                if (a.coordinates.length)
                    for (c = 0; c < a.coordinates.length; c++)
                        if (b = a.coordinates[c], z(b, this.coordinates) && D(this.coordinates, a.coordinates) === !1) return !0;
                return !1
            }
            if ("Polygon" === this.type) {
                for (c = 0; c < this.coordinates.length; c++)
                    if (a.coordinates[c].length === this.coordinates.length)
                        for (j = 0; j < this.coordinates.length; j++)
                            if (J(this.coordinates[j], a.coordinates[c][j])) return !0;
                if (F(this.coordinates, a.coordinates) === !1 && a.coordinates.length) {
                    for (c = 0; c < a.coordinates.length; c++) b = a.coordinates[c], d = z(b, this.coordinates[0][0]) === !1 ? !1 : !0;
                    return d
                }
            } else if ("LineString" === this.type || "MultiPoint" === this.type)
                for (c = 0; c < a.coordinates.length; c++) {
                    var h = {
                        type: "Polygon",
                        coordinates: a.coordinates[c]
                    };
                    return this.within(h) ? !0 : !1
                } else {
                    if ("MultiLineString" === this.type) {
                        for (c = 0; c < this.coordinates.length; c++) {
                            var i = new N(this.coordinates[c]);
                            if (i.within(a) === !1) return !1
                        }
                        return !0
                    }
                    if ("MultiPolygon" === this.type) {
                        for (c = 0; c < a.coordinates.length; c++) {
                            var k = {
                                type: "Polygon",
                                coordinates: a.coordinates[c]
                            };
                            if (this.within(k) === !1) return !1
                        }
                        return !0
                    }
                }
        }
        return !1
    }, K.prototype.intersects = function (b) {
        "Feature" === b.type && (b = b.geometry);
        var c = new K(b);
        if (this.within(b) || c.within(this)) return !0;
        if ("LineString" === this.type) {
            if ("LineString" === b.type) return B(this.coordinates, b.coordinates);
            if ("MultiLineString" === b.type) return C(this.coordinates, b.coordinates);
            if ("Polygon" === b.type) return C(this.coordinates, H(b.coordinates));
            if ("MultiPolygon" === b.type) return E(this.coordinates, b.coordinates)
        } else if ("MultiLineString" === this.type) {
            if ("LineString" === b.type) return C(b.coordinates, this.coordinates);
            if ("Polygon" === b.type || "MultiLineString" === b.type) return D(this.coordinates, b.coordinates);
            if ("MultiPolygon" === b.type) return F(this.coordinates, b.coordinates)
        } else if ("Polygon" === this.type) {
            if ("LineString" === b.type) return C(b.coordinates, H(this.coordinates));
            if ("MultiLineString" === b.type) return D(H(this.coordinates), b.coordinates);
            if ("Polygon" === b.type) return D(H(this.coordinates), H(b.coordinates));
            if ("MultiPolygon" === b.type) return F(H(this.coordinates), b.coordinates)
        } else if ("MultiPolygon" === this.type) {
            if ("LineString" === b.type) return E(b.coordinates, this.coordinates);
            if ("Polygon" === b.type || "MultiLineString" === b.type) return F(H(b.coordinates), this.coordinates);
            if ("MultiPolygon" === b.type) return G(this.coordinates, b.coordinates)
        } else if ("Feature" === this.type) {
            var d = new K(this.geometry);
            return d.intersects(b)
        }
        return a("Type " + this.type + " to " + b.type + " intersection is not supported by intersects"), !1
    }, L.prototype = new K, L.prototype.constructor = L, M.prototype = new K, M.prototype.constructor = M, M.prototype.forEach = function (a) {
        for (var b = 0; b < this.coordinates.length; b++) a.apply(this, [this.coordinates[b], b, this.coordinates]);
        return this
    }, M.prototype.addPoint = function (a) {
        return this.coordinates.push(a), this
    }, M.prototype.insertPoint = function (a, b) {
        return this.coordinates.splice(b, 0, a), this
    }, M.prototype.removePoint = function (a) {
        return "number" == typeof a ? this.coordinates.splice(a, 1) : this.coordinates.splice(this.coordinates.indexOf(a), 1), this
    }, M.prototype.get = function (a) {
        return new L(this.coordinates[a])
    }, N.prototype = new K, N.prototype.constructor = N, N.prototype.addVertex = function (a) {
        return this.coordinates.push(a), this
    }, N.prototype.insertVertex = function (a, b) {
        return this.coordinates.splice(b, 0, a), this
    }, N.prototype.removeVertex = function (a) {
        return this.coordinates.splice(a, 1), this
    }, O.prototype = new K, O.prototype.constructor = O, O.prototype.forEach = function (a) {
        for (var b = 0; b < this.coordinates.length; b++) a.apply(this, [this.coordinates[b], b, this.coordinates])
    }, O.prototype.get = function (a) {
        return new N(this.coordinates[a])
    }, P.prototype = new K, P.prototype.constructor = P, P.prototype.addVertex = function (a) {
        return this.coordinates[0].push(a), this
    }, P.prototype.insertVertex = function (a, b) {
        return this.coordinates[0].splice(b, 0, a), this
    }, P.prototype.removeVertex = function (a) {
        return this.coordinates[0].splice(a, 1), this
    }, P.prototype.close = function () {
        this.coordinates = H(this.coordinates)
    }, Q.prototype = new K, Q.prototype.constructor = Q, Q.prototype.forEach = function (a) {
        for (var b = 0; b < this.coordinates.length; b++) a.apply(this, [this.coordinates[b], b, this.coordinates])
    }, Q.prototype.get = function (a) {
        return new P(this.coordinates[a])
    }, R.prototype = new K, R.prototype.constructor = R, S.prototype = new K, S.prototype.constructor = S, S.prototype.forEach = function (a) {
        for (var b = 0; b < this.features.length; b++) a.apply(this, [this.features[b], b, this.features])
    }, S.prototype.get = function (a) {
        var b;
        return this.forEach(function (c) {
            c.id === a && (b = c)
        }), new R(b)
    }, T.prototype = new K, T.prototype.constructor = T, T.prototype.forEach = function (a) {
        for (var b = 0; b < this.geometries.length; b++) a.apply(this, [this.geometries[b], b, this.geometries])
    }, T.prototype.get = function (a) {
        return new K(this.geometries[a])
    }, V.prototype = new K, V.prototype.constructor = V, V.prototype.recalculate = function () {
        return this.geometry = U(this.properties.center, this.properties.radius, this.properties.steps), this
    }, V.prototype.center = function (a) {
        return a && (this.properties.center = a, this.recalculate()), this.properties.center
    }, V.prototype.radius = function (a) {
        return a && (this.properties.radius = a, this.recalculate()), this.properties.radius
    }, V.prototype.steps = function (a) {
        return a && (this.properties.steps = a, this.recalculate()), this.properties.steps
    }, V.prototype.toJSON = function () {
        var a = K.prototype.toJSON.call(this);
        return a
    }, W.Primitive = K, W.Point = L, W.MultiPoint = M, W.LineString = N, W.MultiLineString = O, W.Polygon = P, W.MultiPolygon = Q, W.Feature = R, W.FeatureCollection = S, W.GeometryCollection = T, W.Circle = V, W.toMercator = q, W.toGeographic = r, W.Tools = {}, W.Tools.positionToMercator = o, W.Tools.positionToGeographic = n, W.Tools.applyConverter = p, W.Tools.toMercator = q, W.Tools.toGeographic = r, W.Tools.createCircle = U, W.Tools.calculateBounds = c, W.Tools.calculateEnvelope = i, W.Tools.coordinatesContainPoint = y, W.Tools.polygonContainsPoint = z, W.Tools.arrayIntersectsArray = B, W.Tools.coordinatesContainPoint = y, W.Tools.coordinatesEqual = J, W.Tools.convexHull = x, W.MercatorCRS = $, W.GeographicCRS = _, W
}),
function (a, b) {
    if ("object" == typeof module && "object" == typeof module.exports && (exports = module.exports = b(require("terraformer"))), "object" == typeof a.navigator) {
        if (!a.Terraformer) throw new Error("Terraformer.ArcGIS requires the core Terraformer library. https://github.com/esri/Terraformer");
        a.Terraformer.ArcGIS = b(a.Terraformer)
    }
}(this, function (Terraformer) {
    function a(a) {
        var b = {};
        for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
        return b
    }

    function b(a) {
        var b, c = 0,
            d = 0,
            e = a.length,
            f = a[d];
        for (d; e - 1 > d; d++) b = a[d + 1], c += (b[0] - f[0]) * (b[1] + f[1]), f = b;
        return c >= 0
    }

    function c(a) {
        var c = [],
            d = a.slice(0),
            e = d.shift().slice(0);
        b(e) || e.reverse(), c.push(e);
        for (var f = 0; f < d.length; f++) {
            var g = d[f].slice(0);
            b(g) && g.reverse(), c.push(g)
        }
        return c
    }

    function d(a) {
        for (var b = [], d = 0; d < a.length; d++)
            for (var e = c(a[d]), f = e.length - 1; f >= 0; f--) {
                var g = e[f].slice(0);
                b.push(g)
            }
        return b
    }

    function e(a, b) {
        var c = Terraformer.Tools.arrayIntersectsArray(a, b),
            d = Terraformer.Tools.coordinatesContainPoint(a, b[0]);
        return !c && d ? !0 : !1
    }

    function f(a) {
        for (var c = [], d = [], f = 0; f < a.length; f++) {
            var g = a[f].slice(0);
            if (b(g)) {
                var h = [g];
                c.push(h)
            } else d.push(g)
        }
        for (; d.length;) {
            for (var i = d.pop(), j = !1, k = c.length - 1; k >= 0; k--) {
                var l = c[k][0];
                if (e(l, i)) {
                    c[k].push(i), j = !0;
                    break
                }
            }
            j || c.push([i.reverse()])
        }
        return 1 === c.length ? {
            type: "Polygon",
            coordinates: c[0]
        } : {
            type: "MultiPolygon",
            coordinates: c
        }
    }

    function g(b) {
        var c = {};
        b.x && b.y && (c.type = "Point", c.coordinates = [b.x, b.y]), b.points && (c.type = "MultiPoint", c.coordinates = b.points.slice(0)), b.paths && (1 === b.paths.length ? (c.type = "LineString", c.coordinates = b.paths[0].slice(0)) : (c.type = "MultiLineString", c.coordinates = b.paths.slice(0))), b.rings && (c = f(b.rings.slice(0))), b.geometry && (c.type = "Feature", c.geometry = g(b.geometry), c.properties = a(b.attributes) || {});
        var d = b.geometry ? b.geometry.spatialReference : b.spatialReference;
        return d && 102100 === d.wkid && (c = Terraformer.toGeographic(c)), new Terraformer.Primitive(c)
    }

    function h(b, e) {
        var f;
        f = e ? e : b && b.crs === Terraformer.MercatorCRS ? {
            wkid: 102100
        } : {
            wkid: 4326
        };
        var g, i = {};
        switch (b.type) {
        case "Point":
            i.x = b.coordinates[0], i.y = b.coordinates[1], i.spatialReference = f;
            break;
        case "MultiPoint":
            i.points = b.coordinates.slice(0), i.spatialReference = f;
            break;
        case "LineString":
            i.paths = [b.coordinates.slice(0)], i.spatialReference = f;
            break;
        case "MultiLineString":
            i.paths = b.coordinates.slice(0), i.spatialReference = f;
            break;
        case "Polygon":
            i.rings = c(b.coordinates.slice(0)), i.spatialReference = f;
            break;
        case "MultiPolygon":
            i.rings = d(b.coordinates.slice(0)), i.spatialReference = f;
            break;
        case "Feature":
            i.geometry = h(b.geometry), i.attributes = a(b.properties);
            break;
        case "FeatureCollection":
            for (i = [], g = 0; g < b.features.length; g++) i.push(h(b.features[g]));
            break;
        case "GeometryCollection":
            for (i = [], g = 0; g < b.geometries.length; g++) i.push(h(b.geometries[g]))
        }
        return i
    }
    var i = {};
    return i.parse = g, i.convert = h, i.toGeoJSON = g, i.fromGeoJSON = h, i
}),
function (a, b) {
    if ("object" == typeof module && "object" == typeof module.exports && (exports = module.exports = b(require("terraformer"))), "object" == typeof a.navigator) {
        if (!a.Terraformer) throw new Error("Terraformer.RTree requires the core Terraformer library. https://github.com/esri/Terraformer");
        a.Terraformer.RTree = b(a.Terraformer).RTree
    }
}(this, function (Terraformer) {
    function a(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }
    var b = {}, c = function (b) {
            var d = 3,
                e = 6;
            isNaN(b) || (d = Math.floor(b / 2), e = b), this.min_width = d, this.max_width = e;
            var f = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                id: "root",
                nodes: []
            };
            ! function () {
                var a = {};
                return function (b) {
                    var c = 0;
                    return b in a ? c = a[b]++ : a[b] = 0, b + "_" + c
                }
            }(), c.Rectangle.squarified_ratio = function (a, b, c) {
                var d = (a + b) / 2,
                    e = a * b,
                    f = e / (d * d);
                return e * c / f
            };
            var g = function (a, b, e) {
                var f = [],
                    g = [],
                    h = [],
                    i = 1;
                if (!a || !c.Rectangle.overlap_rectangle(a, e)) return h;
                var j = {
                    x: a.x,
                    y: a.y,
                    w: a.w,
                    h: a.h,
                    target: b
                };
                g.push(e.nodes.length), f.push(e);
                do {
                    var k = f.pop(),
                        l = g.pop() - 1;
                    if ("target" in j)
                        for (; l >= 0;) {
                            var n = k.nodes[l];
                            if (c.Rectangle.overlap_rectangle(j, n)) {
                                if (j.target && "leaf" in n && n.leaf === j.target || !j.target && ("leaf" in n || c.Rectangle.contains_rectangle(n, j))) {
                                    "nodes" in n ? (h = m(n, !0, [], n), k.nodes.splice(l, 1)) : h = k.nodes.splice(l, 1), c.Rectangle.make_MBR(k.nodes, k), delete j.target, k.nodes.length < d && (j.nodes = m(k, !0, [], k));
                                    break
                                }
                                "nodes" in n && (i += 1, g.push(l), f.push(k), k = n, l = n.nodes.length)
                            }
                            l -= 1
                        } else if ("nodes" in j) {
                            k.nodes.splice(l + 1, 1), k.nodes.length > 0 && c.Rectangle.make_MBR(k.nodes, k);
                            for (var p = 0; p < j.nodes.length; p++) o(j.nodes[p], k);
                            j.nodes.length = 0, 0 === f.length && k.nodes.length <= 1 ? (j.nodes = m(k, !0, j.nodes, k), k.nodes.length = 0, f.push(k), g.push(1)) : f.length > 0 && k.nodes.length < d ? (j.nodes = m(k, !0, j.nodes, k), k.nodes.length = 0) : delete j.nodes
                        } else c.Rectangle.make_MBR(k.nodes, k);
                    i -= 1
                } while (f.length > 0);
                return h
            }, h = function (a, b) {
                    var d, e = -1,
                        f = [];
                    f.push(b);
                    var g = b.nodes;
                    do {
                        -1 !== e && (f.push(g[e]), g = g[e].nodes, e = -1);
                        for (var h = g.length - 1; h >= 0; h--) {
                            var i = g[h];
                            if ("leaf" in i) {
                                e = -1;
                                break
                            }
                            var j = c.Rectangle.squarified_ratio(i.w, i.h, i.nodes.length + 1),
                                k = Math.max(i.x + i.w, a.x + a.w) - Math.min(i.x, a.x),
                                l = Math.max(i.y + i.h, a.y + a.h) - Math.min(i.y, a.y),
                                m = c.Rectangle.squarified_ratio(k, l, i.nodes.length + 2);
                            (0 > e || Math.abs(m - j) < d) && (d = Math.abs(m - j), e = h)
                        }
                    } while (-1 !== e);
                    return f
                }, i = function (a) {
                    for (var b = k(a); a.length > 0;) j(a, b[0], b[1]);
                    return b
                }, j = function (a, b, e) {
                    for (var f, g, h, i = c.Rectangle.squarified_ratio(b.w, b.h, b.nodes.length + 1), j = c.Rectangle.squarified_ratio(e.w, e.h, e.nodes.length + 1), k = a.length - 1; k >= 0; k--) {
                        var l = a[k],
                            m = {};
                        m.x = Math.min(b.x, l.x), m.y = Math.min(b.y, l.y), m.w = Math.max(b.x + b.w, l.x + l.w) - m.x, m.h = Math.max(b.y + b.h, l.y + l.h) - m.y;
                        var n = Math.abs(c.Rectangle.squarified_ratio(m.w, m.h, b.nodes.length + 2) - i),
                            o = {};
                        o.x = Math.min(e.x, l.x), o.y = Math.min(e.y, l.y), o.w = Math.max(e.x + e.w, l.x + l.w) - o.x, o.h = Math.max(e.y + e.h, l.y + l.h) - o.y;
                        var p = Math.abs(c.Rectangle.squarified_ratio(o.w, o.h, e.nodes.length + 2) - j);
                        (!g || !f || Math.abs(p - n) < f) && (g = k, f = Math.abs(p - n), h = n > p ? e : b)
                    }
                    var q = a.splice(g, 1)[0];
                    b.nodes.length + a.length + 1 <= d ? (b.nodes.push(q), c.Rectangle.expand_rectangle(b, q)) : e.nodes.length + a.length + 1 <= d ? (e.nodes.push(q), c.Rectangle.expand_rectangle(e, q)) : (h.nodes.push(q), c.Rectangle.expand_rectangle(h, q))
                }, k = function (a) {
                    for (var b, c, d = a.length - 1, e = 0, f = a.length - 1, g = 0, h = a.length - 2; h >= 0; h--) {
                        var i = a[h];
                        i.x > a[e].x ? e = h : i.x + i.w < a[d].x + a[d].w && (d = h), i.y > a[g].y ? g = h : i.y + i.h < a[f].y + a[f].h && (f = h)
                    }
                    var j = Math.abs(a[d].x + a[d].w - a[e].x),
                        k = Math.abs(a[f].y + a[f].h - a[g].y);
                    return j > k ? d > e ? (b = a.splice(d, 1)[0], c = a.splice(e, 1)[0]) : (c = a.splice(e, 1)[0], b = a.splice(d, 1)[0]) : f > g ? (b = a.splice(f, 1)[0], c = a.splice(g, 1)[0]) : (c = a.splice(g, 1)[0], b = a.splice(f, 1)[0]), [{
                        x: b.x,
                        y: b.y,
                        w: b.w,
                        h: b.h,
                        nodes: [b]
                    }, {
                        x: c.x,
                        y: c.y,
                        w: c.w,
                        h: c.h,
                        nodes: [c]
                    }]
                }, l = function (a, b) {
                    return a.nodes = b.nodes, a.x = b.x, a.y = b.y, a.w = b.w, a.h = b.h, a
                }, m = function (a, b, d, e) {
                    var f = [];
                    if (!c.Rectangle.overlap_rectangle(a, e)) return d;
                    f.push(e.nodes);
                    do
                        for (var g = f.pop(), h = g.length - 1; h >= 0; h--) {
                            var i = g[h];
                            c.Rectangle.overlap_rectangle(a, i) && ("nodes" in i ? f.push(i.nodes) : "leaf" in i && (b ? d.push(i) : d.push(i.leaf)))
                        }
                    while (f.length > 0);
                    return d
                }, n = function (a, b, d, e) {
                    var f = [];
                    if (!c.Rectangle.overlap_rectangle(e, a)) return d;
                    f.push(e.nodes);
                    do
                        for (var g = f.pop(), h = g.length - 1; h >= 0; h--) {
                            var i = g[h];
                            c.Rectangle.overlap_rectangle(i, a) && ("nodes" in i ? f.push(i.nodes) : "leaf" in i && (b ? d.push(i) : d.push(i.leaf)))
                        }
                    while (f.length > 0);
                    return d
                }, o = function (b, d) {
                    var f;
                    if (0 === d.nodes.length) return d.x = b.x, d.y = b.y, d.w = b.w, d.h = b.h, d.nodes.push(b), void 0;
                    var g = h(b, d),
                        j = b;
                    do {
                        if (f && "nodes" in f && 0 === f.nodes.length) {
                            var k = f;
                            f = g.pop();
                            for (var l = 0; l < f.nodes.length; l++)
                                if (f.nodes[l] === k || 0 === f.nodes[l].nodes.length) {
                                    f.nodes.splice(l, 1);
                                    break
                                }
                        } else f = g.pop(); if ("leaf" in j || "nodes" in j || a(j)) {
                            if (a(j)) {
                                for (var m = 0; m < j.length; m++) c.Rectangle.expand_rectangle(f, j[m]);
                                f.nodes = f.nodes.concat(j)
                            } else c.Rectangle.expand_rectangle(f, j), f.nodes.push(j); if (f.nodes.length <= e) j = {
                                x: f.x,
                                y: f.y,
                                w: f.w,
                                h: f.h
                            };
                            else {
                                var n = i(f.nodes);
                                j = n, g.length < 1 && (f.nodes.push(n[0]), g.push(f), j = n[1])
                            }
                        } else c.Rectangle.expand_rectangle(f, j), j = {
                            x: f.x,
                            y: f.y,
                            w: f.w,
                            h: f.h
                        }
                    } while (g.length > 0)
                };
            this.serialize = function (a) {
                a(null, f)
            }, this.deserialize = function (a, b, c) {
                var d = Array.prototype.slice.call(arguments);
                switch (d.length) {
                case 1:
                    b = f;
                    break;
                case 2:
                    "function" == typeof d[1] && (b = f, c = d[1])
                }
                var e = l(b, a);
                c && c(null, e)
            }, this.search = function (a, b) {
                var c;
                if (a.type) {
                    var d = Terraformer.Tools.calculateBounds(a);
                    c = {
                        x: d[0],
                        y: d[1],
                        w: Math.abs(d[0] - d[2]),
                        h: Math.abs(d[1] - d[3])
                    }
                } else c = a;
                var e = [c, !1, [], f];
                if (void 0 === c) throw "Wrong number of arguments. RT.Search requires at least a bounding rectangle.";
                var g = m.apply(this, e);
                b && b(null, g)
            }, this.within = function (a, b) {
                var c;
                if (a.type) {
                    var d = Terraformer.Tools.calculateBounds(a);
                    c = {
                        x: d[0],
                        y: d[1],
                        w: Math.abs(d[0] - d[2]),
                        h: Math.abs(d[1] - d[3])
                    }
                } else c = a;
                var e = [c, !1, [], f];
                if (void 0 === c) throw "Wrong number of arguments. RT.Search requires at least a bounding rectangle.";
                var g = n.apply(this, e);
                b && b(null, g)
            }, this.remove = function (a, b, c) {
                var d = Array.prototype.slice.call(arguments);
                if (1 === d.length && d.push(!1), 3 === d.length && (c = d.pop()), d && d[0] && d[0].type) {
                    var e = Terraformer.Tools.calculateBounds(d[0]);
                    d[0] = {
                        x: e[0],
                        y: e[1],
                        w: Math.abs(e[0] - e[2]),
                        h: Math.abs(e[1] - e[3])
                    }
                }
                if (d.push(f), b === !1) {
                    var h = 0,
                        i = [];
                    do h = i.length, i = i.concat(g.apply(this, d)); while (h !== i.length);
                    c && c(null, i)
                } else {
                    var j = g.apply(this, d);
                    c && c(null, j)
                }
            }, this.insert = function (a, b, c) {
                var d;
                if (a.type) {
                    var e = Terraformer.Tools.calculateBounds(a);
                    d = {
                        x: e[0],
                        y: e[1],
                        w: Math.abs(e[0] - e[2]),
                        h: Math.abs(e[1] - e[3])
                    }
                } else d = a; if (arguments.length < 2) throw "Wrong number of arguments. RT.Insert requires at least a bounding rectangle or GeoJSON and an object.";
                var g = o({
                    x: d.x,
                    y: d.y,
                    w: d.w,
                    h: d.h,
                    leaf: b
                }, f);
                c && c(null, g)
            }
        };
    return c.Rectangle = function (a, b, c, d) {
        var e, f, g, h, i, j;
        a.x ? (e = a.x, g = a.y, 0 !== a.w && !a.w && a.x2 ? (i = a.x2 - a.x, j = a.y2 - a.y) : (i = a.w, j = a.h), f = e + i, h = g + j) : (e = a, g = b, i = c, j = d, f = e + i, h = g + j), this.x1 = this.x = function () {
            return e
        }, this.y1 = this.y = function () {
            return g
        }, this.x2 = function () {
            return f
        }, this.y2 = function () {
            return h
        }, this.w = function () {
            return i
        }, this.h = function () {
            return j
        }, this.toJSON = function () {
            return '{"x":' + e.toString() + ', "y":' + g.toString() + ', "w":' + i.toString() + ', "h":' + j.toString() + "}"
        }, this.overlap = function (a) {
            return this.x() < a.x2() && this.x2() > a.x() && this.y() < a.y2() && this.y2() > a.y()
        }, this.expand = function (a) {
            var b = Math.min(this.x(), a.x()),
                c = Math.min(this.y(), a.y());
            return i = Math.max(this.x2(), a.x2()) - b, j = Math.max(this.y2(), a.y2()) - c, e = b, g = c, this
        }, this.setRect = function (a, b, c, d) {
            var e, f, g, h, i, j;
            a.x ? (e = a.x, g = a.y, 0 !== a.w && !a.w && a.x2 ? (i = a.x2 - a.x, j = a.y2 - a.y) : (i = a.w, j = a.h), f = e + i, h = g + j) : (e = a, g = b, i = c, j = d, f = e + i, h = g + j)
        }
    }, c.Rectangle.overlap_rectangle = function (a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    }, c.Rectangle.contains_rectangle = function (a, b) {
        return a.x + a.w <= b.x + b.w && a.x >= b.x && a.y + a.h <= b.y + b.h && a.y >= b.y
    }, c.Rectangle.expand_rectangle = function (a, b) {
        var c, d;
        return c = a.x < b.x ? a.x : b.x, d = a.y < b.y ? a.y : b.y, a.w = a.x + a.w > b.x + b.w ? a.x + a.w - c : b.x + b.w - c, a.h = a.y + a.h > b.y + b.h ? a.y + a.h - d : b.y + b.h - d, a.x = c, a.y = d, a
    }, c.Rectangle.make_MBR = function (a, b) {
        if (a.length < 1) return {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        b ? (b.x = a[0].x, b.y = a[0].y, b.w = a[0].w, b.h = a[0].h) : b = {
            x: a[0].x,
            y: a[0].y,
            w: a[0].w,
            h: a[0].h
        };
        for (var d = a.length - 1; d > 0; d--) c.Rectangle.expand_rectangle(b, a[d]);
        return b
    }, b.RTree = c, b
}), L.esri = {
    _callback: {}
}, L.esri.Support = {
    CORS: false//!! (window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest)
}, L.esri.RequestHandlers = {
    CORS: function (a, b, c, d) {
        var e = new XMLHttpRequest;
        b.f = "json", e.onreadystatechange = function () {
            var a;
            if (4 === e.readyState) {
                try {
                    a = JSON.parse(e.responseText)
                } catch (b) {
                    a = {
                        error: "Could not parse response as JSON."
                    }
                }
                d ? c.call(d, a) : c(a)
            }
        }, e.open("GET", a + L.esri.Util.serialize(b), !0), e.send(null)
    },
    JSONP: function (a, b, c, d) {
        var e = "c" + (1e9 * Math.random()).toString(36).replace(".", "_");
        b.f = "json", b.callback = "L.esri._callback." + e;
        var f = document.createElement("script");
        f.type = "text/javascript", f.src = a + L.esri.Util.serialize(b), f.id = e, L.esri._callback[e] = function (a) {
            d ? c.call(d, a) : c(a), document.body.removeChild(f), delete L.esri._callback[e]
        }, document.body.appendChild(f)
    }
}, L.esri.get = L.esri.Support.CORS ? L.esri.RequestHandlers.CORS : L.esri.RequestHandlers.JSONP, L.esri.Util = {
    debounce: function (a, b) {
        var c = null;
        return function () {
            var d = this || d,
                e = arguments;
            clearTimeout(c), c = setTimeout(function () {
                a.apply(d, e)
            }, b)
        }
    },
    roundAwayFromZero: function (a) {
        return a > 0 ? Math.ceil(a) : Math.floor(a)
    },
    trim: function (a) {
        return a.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    },
    cleanUrl: function (a) {
        return a = L.esri.Util.trim(a), "/" !== a[a.length - 1] && (a += "/"), a
    },
    serialize: function (a) {
        var b = "?";
        for (var c in a)
            if (a.hasOwnProperty(c)) {
                var d = c,
                    e = a[c];
                b += encodeURIComponent(d), b += "=", b += encodeURIComponent(e), b += "&"
            }
        return b.substring(0, b.length - 1)
    },
    indexOf: function (a, b, c) {
        if (c = c || 0, a.indexOf) return a.indexOf(b, c);
        for (var d = c, e = a.length; e > d; d++)
            if (a[d] === b) return d;
        return -1
    },
    extentToBounds: function (a) {
        var b = new L.LatLng(a.ymin, a.xmin),
            c = new L.LatLng(a.ymax, a.xmax);
        return new L.LatLngBounds(b, c)
    },
    boundsToExtent: function (a) {
        return {
            xmin: a.getSouthWest().lng,
            ymin: a.getSouthWest().lat,
            xmax: a.getNorthEast().lng,
            ymax: a.getNorthEast().lat,
            spatialReference: {
                wkid: 4326
            }
        }
    },
    boundsToEnvelope: function (a) {
        var b = L.esri.Util.boundsToExtent(a);
        return {
            x: b.xmin,
            y: b.ymin,
            w: Math.abs(b.xmin - b.xmax),
            h: Math.abs(b.ymin - b.ymax)
        }
    }
}, L.esri.Mixins = {}, L.esri.Mixins.featureGrid = {
    _activeRequests: 0,
    _initializeFeatureGrid: function (a) {
        this._map = a, this._previousCells = [], this.center = this._map.getCenter(), this.origin = this._map.project(this.center), this._moveHandler = L.esri.Util.debounce(function (a) {
            "zoomend" === a.type && (this.origin = this._map.project(this.center), this._previousCells = []), this._requestFeatures(a.target.getBounds())
        }, this.options.debounce, this), a.on("zoomend resize move", this._moveHandler, this), this._requestFeatures(a.getBounds())
    },
    _destroyFeatureGrid: function (a) {
        a.off("zoomend resize move", this._moveHandler, this)
    },
    _requestFeatures: function (a) {
        var b = this._cellsWithin(a);
        b && this.fire("loading", {
            bounds: a
        });
        for (var c = 0; c < b.length; c++) this._makeRequest(b[c], b, a)
    },
    _makeRequest: function (a, b, c) {
        this._activeRequests++, L.esri.get(this.url + "query", {
            geometryType: "esriGeometryEnvelope",
            geometry: JSON.stringify(L.esri.Util.boundsToExtent(a.bounds)),
            outFields: "*",
            outSr: 4326
        }, function (a) {
            this._activeRequests--, this._activeRequests <= 0 && this.fire("load", {
                bounds: c,
                cells: b
            }), this._render(a)
        }, this)
    },
    _cellsWithin: function (a) {
        var b = this._map.getSize(),
            c = this._map.project(this._map.getCenter());
        Math.min(this.options.cellSize / b.x, this.options.cellSize / b.y);
        for (var d = a.pad(.1), e = [], f = this._map.project(d.getNorthWest()), g = this._map.project(d.getSouthEast()), h = f.subtract(c).divideBy(this.options.cellSize), i = g.subtract(c).divideBy(this.options.cellSize), j = Math.round((this.origin.x - c.x) / this.options.cellSize), k = Math.round((this.origin.y - c.y) / this.options.cellSize), l = L.esri.Util.roundAwayFromZero(h.x) - j, m = L.esri.Util.roundAwayFromZero(i.x) - j, n = L.esri.Util.roundAwayFromZero(h.y) - k, o = L.esri.Util.roundAwayFromZero(i.y) - k, p = l; m > p; p++)
            for (var q = n; o > q; q++) {
                var r = "cell:" + p + ":" + q,
                    s = L.esri.Util.indexOf(this._previousCells, r) >= 0;
                if (!s || !this.options.deduplicate) {
                    var t = this._cellExtent(p, q),
                        u = t.getCenter(),
                        v = u.distanceTo(t.getNorthWest()),
                        w = u.distanceTo(this.center),
                        x = {
                            row: p,
                            col: q,
                            id: r,
                            center: u,
                            bounds: t,
                            distance: w,
                            radius: v
                        };
                    e.push(x), this._previousCells.push(r)
                }
            }
        return e.sort(function (a, b) {
            return a.distance - b.distance
        }), e
    },
    _cellExtent: function (a, b) {
        var c = this._cellPoint(a, b),
            d = this._cellPoint(a + 1, b + 1),
            e = this._map.unproject(c),
            f = this._map.unproject(d);
        return L.latLngBounds(e, f)
    },
    _cellPoint: function (a, b) {
        var c = this.origin.x + a * this.options.cellSize,
            d = this.origin.y + b * this.options.cellSize;
        return [c, d]
    }
}, L.esri.Mixins.identifiableLayer = {
    identify: function (a, b, c) {
        var d, e = {
                sr: "4265",
                mapExtent: JSON.stringify(L.esri.Util.boundsToExtent(this._map.getBounds())),
                tolerance: 3,
                geometryType: "esriGeometryPoint",
                imageDisplay: "800,600,96",
                geometry: JSON.stringify({
                    x: a.lng,
                    y: a.lat,
                    spatialReference: {
                        wkid: 4265
                    }
                })
            };
        "function" == typeof b && "undefined" == typeof c ? (c = b, d = e) : "object" == typeof b && (b.layerDefs && (b.layerDefs = this.parseLayerDefs(b.layerDefs)), d = L.Util.extend(e, b)), L.esri.get(this._url + "/identify", d, c)
    },
    parseLayerDefs: function (a) {
        return a instanceof Array ? "" : "object" == typeof a ? JSON.stringify(a) : a
    }
},
function (a) {
    var b = "https:" !== window.location.protocol ? "http:" : "https:",
        c = "line-height:9px; text-overflow:ellipsis; white-space:nowrap;overflow:hidden; display:inline-block;",
        d = "position:absolute; top:-38px; right:2px;",
        e = "<img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='" + d + "'>",
        f = function (a) {
            return "<span class='esri-attributions' style='" + c + "'>" + a + "</span>"
        };
    a.esri.BasemapLayer = a.TileLayer.extend({
        statics: {
            TILES: {
                Streets: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}/",
                    attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map?f=json",
                    options: {
                        minZoom: 1,
                        maxZoom: 19,
                        subdomains: ["server", "services"],
                        attribution: f("Esri") + e
                    }
                },
                Topographic: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}/",
                    attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map?f=json",
                    options: {
                        minZoom: 1,
                        maxZoom: 19,
                        subdomains: ["server", "services"],
                        attribution: f("Esri") + e
                    }
                },
                Oceans: {
                    urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}/",
                    attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap?f=json",
                    options: {
                        minZoom: 1,
                        maxZoom: 16,
                        subdomains: ["server", "services"],
                        attribution: f("Esri") + e
                    }
                },
                NationalGeographic: {
                    urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}/",
                    options: {
                        minZoom: 1,
                        maxZoom: 16,
                        subdomains: ["server", "services"],
                        attribution: f("Esri") + e
                    }
                },
                Gray: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}/",
                    options: {
                        minZoom: 1,
                        maxZoom: 16,
                        subdomains: ["server", "services"],
                        attribution: f("Esri, NAVTEQ, DeLorme") + e
                    }
                },
                GrayLabels: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}/",
                    options: {
                        minZoom: 1,
                        maxZoom: 16,
                        subdomains: ["server", "services"]
                    }
                },
                Imagery: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/",
                    options: {
                        minZoom: 1,
                        maxZoom: 19,
                        subdomains: ["server", "services"],
                        attribution: f("Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community") + e
                    }
                },
                ImageryLabels: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}/",
                    options: {
                        minZoom: 1,
                        maxZoom: 19,
                        subdomains: ["server", "services"]
                    }
                },
                ImageryTransportation: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}/",
                    options: {
                        minZoom: 1,
                        maxZoom: 19,
                        subdomains: ["server", "services"]
                    }
                },
                ImageryAlternateLabels: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}/",
                    options: {
                        minZoom: 1,
                        maxZoom: 12,
                        subdomains: ["server", "services"]
                    }
                },
                ShadedRelief: {
                    urlTemplate: b + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}/",
                    options: {
                        minZoom: 1,
                        maxZoom: 13,
                        subdomains: ["server", "services"],
                        attribution: f("ESRI, NAVTEQ, DeLorme") + e
                    }
                }
            }
        },
        initialize: function (b, c) {
            var d;
            if ("object" == typeof b && b.urlTemplate && b.options) d = b;
            else {
                if ("string" != typeof b || !a.esri.BasemapLayer.TILES[b]) throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ImageryAlternateLabels' or 'ShadedRelief'");
                d = a.esri.BasemapLayer.TILES[b]
            }
            var e = a.Util.extend(d.options, c),
                f = a.esri.Util.cleanUrl(d.urlTemplate);
            if (a.TileLayer.prototype.initialize.call(this, f, a.Util.setOptions(this, e)), d.attributionUrl) {
                var g = a.esri.Util.cleanUrl(d.attributionUrl);
                this._dynamicAttribution = !0, this._getAttributionData(g)
            }
        },
        _dynamicAttribution: !1,
        bounds: null,
        zoom: null,
        onAdd: function (b) {
            a.TileLayer.prototype.onAdd.call(this, b), this._dynamicAttribution && (this.on("load", this._handleTileUpdates, this), this._map.on("viewreset zoomend dragend", this._handleTileUpdates, this)), this._map.on("resize", this._resizeAttribution, this)
        },
        onRemove: function (b) {
            this._dynamicAttribution && (this.off("load", this._handleTileUpdates, this), this._map.off("viewreset zoomend dragend", this._handleTileUpdates, this)), this._map.off("resize", this._resizeAttribution, this), a.TileLayer.prototype.onRemove.call(this, b)
        },
        _handleTileUpdates: function (a) {
            var b, c;
            "load" === a.type && (b = this._map.getBounds(), c = this._map.getZoom()), ("viewreset" === a.type || "dragend" === a.type || "zoomend" === a.type) && (b = a.target.getBounds(), c = a.target.getZoom()), this.attributionBoundingBoxes && b && c && (b.equals(this.bounds) && c === this.zoom || (this.bounds = b, this.zoom = c, this._updateMapAttribution()))
        },
        _resizeAttribution: function () {
            var a = this._map.getSize().x;
            this._getAttributionLogo().style.display = 600 > a ? "none" : "block", this._getAttributionSpan().style.maxWidth = .75 * a + "px"
        },
        _getAttributionData: function (b) {
            this.attributionBoundingBoxes = [], a.esri.get(b, {}, this._processAttributionData, this)
        },
        _processAttributionData: function (b) {
            for (var c = 0; c < b.contributors.length; c++)
                for (var d = b.contributors[c], e = 0; e < d.coverageAreas.length; e++) {
                    var f = d.coverageAreas[e],
                        g = new a.LatLng(f.bbox[0], f.bbox[1]),
                        h = new a.LatLng(f.bbox[2], f.bbox[3]);
                    this.attributionBoundingBoxes.push({
                        attribution: d.attribution,
                        score: f.score,
                        bounds: new a.LatLngBounds(g, h),
                        minZoom: f.zoomMin,
                        maxZoom: f.zoomMax
                    })
                }
            this.attributionBoundingBoxes.sort(function (a, b) {
                return a.score < b.score ? -1 : a.score > b.score ? 1 : 0
            }), this.bounds && this._updateMapAttribution()
        },
        _getAttributionSpan: function () {
            return this._map._container.querySelectorAll(".esri-attributions")[0]
        },
        _getAttributionLogo: function () {
            return this._map._container.querySelectorAll(".esri-attribution-logo")[0]
        },
        _updateMapAttribution: function () {
            for (var a = "", b = 0; b < this.attributionBoundingBoxes.length; b++) {
                var c = this.attributionBoundingBoxes[b];
                if (this.bounds.intersects(c.bounds) && this.zoom >= c.minZoom && this.zoom <= c.maxZoom) {
                    var d = this.attributionBoundingBoxes[b].attribution; - 1 === a.indexOf(d) && (a.length > 0 && (a += ", "), a += d)
                }
            }
            this._getAttributionSpan().innerHTML = a, this._resizeAttribution()
        }
    }), a.esri.basemapLayer = function (b, c) {
        return new a.esri.BasemapLayer(b, c)
    }
}(L),
function (a) {
    function b(a, b) {
        var c = b ? "block" : "none";
        if (a._icon && (a._icon.style.display = c), a._shadow && (a._shadow.style.display = c), a._layers)
            for (var d in a._layers) a._layers.hasOwnProperty(d) && (a._layers[d]._container.style.display = c)
    }
    a.esri.FeatureLayer = a.GeoJSON.extend({
        includes: a.esri.Mixins.featureGrid,
        options: {
            cellSize: 512,
            debounce: 100,
            deduplicate: !0
        },
        initialize: function (b, c) {
            this.index = new Terraformer.RTree, this.url = a.esri.Util.cleanUrl(b), a.Util.setOptions(this, c), a.esri.get(this.url, {}, function (a) {
                this.fire("metadata", {
                    metadata: a
                })
            }, this), a.GeoJSON.prototype.initialize.call(this, [], c)
        },
        onAdd: function (b) {
            a.LayerGroup.prototype.onAdd.call(this, b), b.on("zoomend resize move", this._update, this), this._initializeFeatureGrid(b)
        },
        onRemove: function (b) {
            b.off("zoomend resize move", this._update, this), a.LayerGroup.prototype.onRemove.call(this, b), this._destroyFeatureGrid(b)
        },
        getLayerId: function (a) {
            return a.feature.id
        },
        _update: function (c) {
            var d = a.esri.Util.boundsToEnvelope(c.target.getBounds());
            this.index.search(d, a.Util.bind(function (c, d) {
                this.eachLayer(a.Util.bind(function (c) {
                    var e = c.feature.id;
                    b(c, a.esri.Util.indexOf(d, e) >= 0)
                }, this))
            }, this))
        },
        _render: function (a) {
            if (a.objectIdFieldName && a.features.length && !a.error)
                for (var b = a.objectIdFieldName, c = a.features.length - 1; c >= 0; c--) {
                    var d = a.features[c],
                        e = d.attributes[b];
                    if (!this._layers[e]) {
                        var f = Terraformer.ArcGIS.parse(d);
                        f.id = e, this.index.insert(f, e), this.addData(f);
                        var g = this._layers[e];
                        this.fire("render", {
                            feature: g,
                            geojson: f
                        })
                    }
                }
        }
    }), a.esri.featureLayer = function (b, c) {
        return new a.esri.FeatureLayer(b, c)
    }
}(L), L.esri.TiledMapLayer = L.TileLayer.extend({
    includes: L.esri.Mixins.identifiableLayer,
    initialize: function (a, b) {
        b = b || {}, this.serviceUrl = L.esri.Util.cleanUrl(a), this.tileUrl = this.serviceUrl + "tile/{z}/{y}/{x}", this.tileUrl.match("://tiles.arcgis.com") && (this.tileUrl = this.tileUrl.replace("://tiles.arcgis.com", "://tiles{s}.arcgis.com"), b.subdomains = ["1", "2", "3", "4"]), L.esri.get(this.serviceUrl, {}, function (a) {
            this.fire("metadata", {
                metadata: a
            })
        }, this), L.TileLayer.prototype.initialize.call(this, this.tileUrl, b)
    }
}), L.esri.tiledMapLayer = function (a, b) {
    return new L.esri.TiledMapLayer(a, b)
},
/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Sanborn Map Company, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
L.esri.DynamicMapLayer = L.ImageOverlay.extend({
    includes: L.esri.Mixins.identifiableLayer,
    defaultParams: {
        format: "png8",
        transparent: !0,
        f: "image",
        bboxSR: 102100,
        imageSR: 102100,
        layers: "",
        opacity: 1
    },
    initialize: function (a, b) {
        this._url = L.esri.Util.cleanUrl(a), this._layerParams = L.Util.extend({}, this.defaultParams);
        for (var c in b) this.options.hasOwnProperty(c) || (this._layerParams[c] = b[c]);
        delete this._layerParams.token, this._parseLayers(), this._parseLayerDefs(), L.esri.get(this._url, {}, function (a) {
            this.fire("metadata", {
                metadata: a
            })
        }, this), L.Util.setOptions(this, b)
    },
    onAdd: function (a) {
        if (this._map = a, this._image || this._initImage(), a._panes.overlayPane.appendChild(this._image), a.on({
            viewreset: this._reset,
            moveend: this._update,
            zoomend: this._zoomUpdate
        }, this), a.options.zoomAnimation && L.Browser.any3d && a.on("zoomanim", this._animateZoom, this), a.options.crs && a.options.crs.code) {
            var b = a.options.crs.code.split(":")[1];
            this._layerParams.bboxSR = b, this._layerParams.imageSR = b
        }
        this._reset()
    },
    onRemove: function (a) {
        a.getPanes().overlayPane.removeChild(this._image), a.off({
            viewreset: this._reset,
            moveend: this._update
        }, this), a.options.zoomAnimation && a.off("zoomanim", this._animateZoom, this)
    },
    _animateZoom: function (a) {
        var b = this._map,
            c = this._image,
            d = b.getZoomScale(a.zoom),
            e = this._map.getBounds().getNorthWest(),
            f = this._map.getBounds().getSouthEast(),
            g = b._latLngToNewLayerPoint(e, a.zoom, a.center),
            h = b._latLngToNewLayerPoint(f, a.zoom, a.center)._subtract(g),
            i = g._add(h._multiplyBy(.5 * (1 - 1 / d)));
        c.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(i) + " scale(" + d + ") "
    },
    _parseLayers: function () {
        if ("undefined" == typeof this._layerParams.layers) return delete this._layerParams.layerOption, void 0;
        var a = this._layerParams.layerOption || null,
            b = this._layerParams.layers || null,
            c = "show",
            d = ["show", "hide", "include", "exclude"];
        if (delete this._layerParams.layerOption, a) - 1 !== d.indexOf(a) && (c = a), this._layerParams.layers = c + ":" + b;
        else if (b instanceof Array) this._layerParams.layers = c + ":" + b.join(",");
        else if ("string" == typeof b) {
            var e = b.match(":");
            e && (b = b.split(e[0]), Number(b[1].split(",")[0]) && (-1 !== d.indexOf(b[0]) && (c = b[0]), b = b[1])), this._layerParams.layers = c + ":" + b
        }
    },
    _parseLayerDefs: function () {
        if ("undefined" != typeof this._layerParams.layerDefs) {
            var a = this._layerParams.layerDefs,
                b = [];
            if (a instanceof Array)
                for (var c = a.length, d = 0; c > d; d++) a[d] && b.push(d + ":" + a[d]);
            else {
                if ("object" != typeof a) return delete this._layerParams.layerDefs, void 0;
                for (var e in a) a.hasOwnProperty(e) && b.push(e + ":" + a[e])
            }
            this._layerParams.layerDefs = b.join(";")
        }
    },
    _initImage: function () {
        this._image = L.DomUtil.create("img", "leaflet-image-layer"), this._map.options.zoomAnimation && L.Browser.any3d ? L.DomUtil.addClass(this._image, "leaflet-zoom-animated") : L.DomUtil.addClass(this._image, "leaflet-zoom-hide"), this._updateOpacity(), L.Util.extend(this._image, {
            galleryimg: "no",
            onselectstart: L.Util.falseFn,
            onmousemove: L.Util.falseFn,
            onload: L.Util.bind(this._onImageLoad, this),
            src: this._getImageUrl()
        })
    },
    _getImageUrl: function () {
        var a = this._map.getBounds(),
            b = this._map.getSize(),
            c = this._map.options.crs.project(a._northEast),
            d = this._map.options.crs.project(a._southWest);
        this._layerParams.bbox = [d.x, d.y, c.x, c.y].join(","), this._layerParams.size = b.x + "," + b.y;
        var e = this._url + "export" + L.Util.getParamString(this._layerParams);
        return "undefined" != typeof this.options.token && (e = e + "&token=" + this.options.token), e
    },
    _update: function () {
        if (!this._map._panTransition || !this._map._panTransition._inProgress) {
            var a = this._map.getZoom();
            a > this.options.maxZoom || a < this.options.minZoom || (this._newImage = L.DomUtil.create("img", "leaflet-image-layer"), this._map.options.zoomAnimation && L.Browser.any3d ? L.DomUtil.addClass(this._newImage, "leaflet-zoom-animated") : L.DomUtil.addClass(this._newImage, "leaflet-zoom-hide"), this._updateOpacity(), L.Util.extend(this._newImage, {
                galleryimg: "no",
                onselectstart: L.Util.falseFn,
                onmousemove: L.Util.falseFn,
                onload: L.Util.bind(this._onNewImageLoad, this),
                src: this._getImageUrl()
            }))
        }
    },
    _updateOpacity: function () {
        L.DomUtil.setOpacity(this._image, this.options.opacity), this._newImage && L.DomUtil.setOpacity(this._newImage, this.options.opacity)
    },
    _zoomUpdate: function () {},
    _onNewImageLoad: function () {
        var a = this._map.getBounds(),
            b = L.latLng(a._northEast.lat, a._southWest.lng),
            c = L.latLng(a._southWest.lat, a._northEast.lng),
            d = this._map.latLngToLayerPoint(b),
            e = this._map.latLngToLayerPoint(c)._subtract(d);
        L.DomUtil.setPosition(this._newImage, d), this._newImage.style.width = e.x + "px", this._newImage.style.height = e.y + "px", null == this._image ? this._map._panes.overlayPane.appendChild(this._newImage) : this._map._panes.overlayPane.insertBefore(this._newImage, this._image), this._map._panes.overlayPane.removeChild(this._image), this._image = this._newImage, this._newImage = null
    },
    _onImageLoad: function () {
        this.fire("load")
    },
    _reset: function () {}
}), L.esri.dynamicMapLayer = function (a, b) {
    return new L.esri.DynamicMapLayer(a, b)
};