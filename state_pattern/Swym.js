function getSwymConfig() {
    return { host: "//store.swymrelay.com", assets: "//swymprod.azureedge.net/code/", ttl: 1800 };
}
window._swat
    ? SwymUtils.log("Swym already loaded")
    : (function () {
          function Y(a) {
              this.storage = a.storage;
              this.sw = a;
              var b = SwymUtils.getEncodedAsObject(location.href);
              b.utm_source && -1 < b.utm_source.indexOf("swym") && ((a = this.storage.get(this.sw.key.UTM)), (b = SwymUtils.getHashCode(b.utm_source)), a != b && (this.remove(), this.storage.set(this.sw.key.UTM, b)));
              this.sessionId = this.getSessionId();
          }
          function F() {
              this.primaryDomain = Wa();
              this.canStoreLocally = Xa();
              document.cookie = "__verify=1";
              var a = 1 <= document.cookie.length && -1 !== document.cookie.indexOf("__verify=1");
              document.cookie = "__verify=1;expires=" + new Date(1976, 8, 16).toUTCString();
              this.cookieEnabled = a;
          }
          function Wa() {
              var a = window.location.hostname;
              if (a.search(".myshopify.com")) return a;
              var b = a.split(".").length,
                  c = "";
              if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(a) && 2 <= b) {
                  for (var a = 0, b = document.domain, c = b.split("."), d = "_gd" + new Date().getTime(); a < c.length - 1 && -1 == document.cookie.indexOf(d + "=" + d); )
                      (b = c.slice(-1 - ++a).join(".")), (document.cookie = d + "=" + d + ";domain=" + b + ";");
                  document.cookie = d + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + b + ";";
                  c = b;
              }
              return c;
          }
          function Xa() {
              if ("undefined" != typeof window.Storage)
                  try {
                      return window.localStorage.setItem("lstest", "lstest"), window.localStorage.removeItem("lstest"), !0;
                  } catch (a) {
                      return !1;
                  }
              else return !1;
          }
          function R(a, b, c) {
              this.cacheName = a;
              this.cacheTimestampName = this.cacheName + "_timestamp";
              this.cacheTTL = b || getSwymConfig().ttl || 300;
              this.storage = c;
          }
          function A(a) {
              this.name = a.name;
              this.config = SwymUtils.extendDefaults(a, this.defaultOpts);
              for (var b in this.config) this[b] = this.config[b];
              this.inProgress = {};
              this.callbacks = {};
              this.evtLayer = document.createElement("Swym-model-" + this.name);
              var c = this;
              this.mcache = null;
              this.cached && (this.lcache = new R(this.name, this.expireInmem, this.swat.storage));
              var d = function () {
                  c.makeCacheStale();
              };
              this.cacheStaleEvts.forEach(function (a) {
                  this.swat.evtLayer.addEventListener(a, d);
              }, this);
          }
          function f() {
              this.Mustache = window.Mustache;
              this.swymHost = Ya();
              this.utils = SwymUtils;
              this.key = {
                  PID: "pid",
                  REMOTEAUTH: "remoteAuth",
                  REGID: "swymRegid",
                  MISAUTHCHK: "isCheckedForMisauth",
                  INSTRMAP: "instrumentMap",
                  EMAIL: "email",
                  SESSIONID: "session-id",
                  POSTLOGINRD: "pstlgnrd",
                  UTM: "shutm",
                  VERSIONCHECKED: "v-ckd",
                  TURNOFF: "t-off",
                  PRODUCTSVERSION: "p-v",
                  PRODUCTSMIGRATE: "p-m",
                  RSETCACHE: "rconfig_cache",
                  RAPPSCACHE: "rapps_cache",
                  EXMPTD: "b_exmptd",
                  BADRID: "badrid",
                  WEML: "weml",
                  O_S: "o_s",
                  CLCTMAP: "clctmap",
                  DNFCHK: "dnfchk",
                  SVD: "nf_svd",
                  UPREF: "u_pref",
                  TPERMTS: "tpermts",
                  TIERMISMATCH: "t_m",
              };
              this.evtLayer = document.createElement("Swym");
              this.currentPageData = {};
              this.Storage = F;
              this.storage = new F();
              this.session = new Y(this);
              this.session.setOnStart(tb(this));
              this.storage.cookieEnabled || (SwymUtils.error("Cookies Disabled", Error("CookiesDisabled")), this.turnOff());
              if (SwymUtils.isBot()) console.warn("Bot detected - turning off"), this.turnOff();
              else {
                  var a = v.push;
                  this.__SA_READY();
                  v.forEach(function (a) {
                      this.loadModule(a);
                  }, this);
                  var b = this;
                  v.push = function (c) {
                      b.loadModule(c);
                      a.apply(b, [c]);
                  };
                  this.disableNotifications = !0;
                  this.currency = null;
                  b = this;
                  if (window.SwymUtils) {
                      var c = (SwymUtils.originalRenderFn = SwymUtils.renderTemplateString);
                      SwymUtils.renderTemplateString = function (a, e) {
                          e.STRINGS = b.retailerSettings.Strings;
                          e.SETTINGS = b.retailerSettings;
                          return c.apply(SwymUtils, [a, e]);
                      };
                  }
                  this.evtLayer.addEventListener(this.JSEvents.regidRefreshed, function () {
                      b.allGetInternal();
                  });
                  this.evtLayer.addEventListener(this.JSEvents.trackedPageView, function (a) {
                      var c = a.detail.d.epi;
                      if (c) {
                          b.api.fetch(function (c) {
                              for (var e = 0; e < c.length; e++) if (c[e].epi == a.detail.d.epi) return;
                              b.triggerSwymEvent(b.JSEvents.newProductTracked, a.detail.d);
                          });
                          var g = a.detail.d.uri,
                              k = ((g && SwymUtils.getEncodedAsObject(g)) || {})["sw-rfr"];
                          k &&
                              ((c = a.detail.d.epi),
                              SwymUtils.debounce(function (a) {
                                  b.instrument(b.Instrumentations.WidgetItemOpen, { epi: c, rfr: k });
                              }, 10)());
                      }
                  });
                  this.platform &&
                      (this.platform.isAdminMode &&
                          this.platform.isAdminMode() &&
                          (this.clearSettingsCache(),
                          this.exemptDevice(),
                          this.evtLayer.addEventListener(this.JSEvents.readSettings, function () {
                              b.clearSettingsCache();
                              b.exemptDevice();
                          })),
                      this.initProductDetailsAPI());
              }
          }
          function Za(a, b) {
              var c = JSON.parse(a.settings).General.RemoteConfig;
              if (c) {
                  var d = window.getSwymConfig();
                  c.host != d.host &&
                      (SwymUtils.warn("Tier mismatch found, contact Swym support team to address this."),
                      (window.getSwymConfig = function () {
                          return SwymUtils.extendDefaults(c, d);
                      }),
                      (b.swymHost = Ya()),
                      b.storage.get(b.key.TIERMISMATCH) ||
                          b.reportTierMismatch(
                              function () {
                                  b.storage.setSessionData(b.key.TIERMISMATCH, !0);
                              },
                              function (a) {
                                  SwymUtils.log("Failed to report mismatch", a);
                              }
                          ));
              }
          }
          function tb(a) {
              return function () {
                  a.storage.performMigration();
              };
          }
          function ub(a) {
              for (var b, c, d = !0, e = Object.keys(a), g = 0, k = e.length; g < k; g += 1)
                  if (((c = e[g]), (b = a[c]), "cprops" === c)) {
                      if (500 < JSON.stringify(b).length) {
                          d = !1;
                          break;
                      }
                  } else if ("string" === typeof b && 500 < b.length) {
                      d = !1;
                      break;
                  }
              if (!d) throw Error("Param value exceeded length limit. Operation not allowed.");
          }
          function Ya() {
              var a = getSwymConfig(),
                  b = window.location.protocol;
              getSwymConfig().force_protocol && (b = "http:");
              return b + a.host;
          }
          function $a(a) {
              var b = 200 > a.status || 399 < a.status;
              b && SwymUtils.log("HTTP err: " + a.status + ". Msg: " + a.statusText);
              return !b;
          }
          function xa(a) {
              return (a = RegExp("[?&]" + a + "=([^&]*)").exec(window.location.search)) ? decodeURIComponent(a[1].replace(/\+/g, " ")) : null;
          }
          function ga(a) {
              var b = window.document,
                  c = {},
                  d = SwymUtils.getPageURL();
              c.uri = window.swymLandingURL || b.URL;
              c.dt = b.title;
              c.du = d;
              var d = document.querySelectorAll("li[class^=category]"),
                  e = "";
              if (null != d && 0 < d.length) for (var g = 0; g < d.length; g++) (e += d[g].innerText), (e += " || ");
              c.ct = e;
              (d = xa("utm_source")) ? ((e = xa("utm_medium")), (d = "swym" == d ? "swym:" + ("tooltip" == e ? "notification" : e) : d + ":" + (e ? e : ""))) : (d = (d = xa("sw_rc")) ? d : "default");
              c.rc = d;
              O.retailerSettings && O.retailerSettings.General.ProductLevel && (c.type = O.retailerSettings.General.ProductLevel);
              b.referrer && (c.ru = b.referrer.substr(0, 4e3));
              a = D(a, c);
              a.hasOwnProperty("op") && (null == a.op || a.op <= a.pr) && delete a.op;
              a.ct && 200 < a.ct.length && (a.ct = a.ct.substr(0, 200).trim());
              T(a.et) && ((b = a.ct), (b = (c = a.dt) && 0 < c.length ? 1 : b && 0 < b.length ? 2 : 0), (a.et = b));
              return a;
          }
          function D(a, b) {
              a || (a = {});
              for (var c in b) T(a[c]) && (a[c] = b[c]);
              return a;
          }
          function T(a) {
              return "undefined" == typeof a;
          }
          function ka(a) {
              if ("" == a) return a;
              var b;
              try {
                  b = JSON.parse(a);
              } catch (c) {
                  SwymUtils.log(c);
              }
              return b;
          }
          function P(a) {
              vb.push(this);
              for (var b in a) this[b] = a[b];
              this.target = document.querySelector(this.targetSelector);
              var c = this;
              setTimeout(function () {
                  c.init();
              }, 1e3);
          }
          function ab() {
              h.isAlreadyAuth() ||
                  (new P({
                      id: atob("U09VTkRFU1Q="),
                      type: "jsonp",
                      detectType: "email",
                      targetSelector: atob("I3NvdW5kZXN0LWpzb25wLWNvbnRhaW5lcg=="),
                      listenThreshold: 1,
                      isValid: function () {
                          return window[this.id] && window.MutationObserver && this.target;
                      },
                      detect: function (a) {
                          var b = a[atob("ZW1haWw=")];
                          a = a.source;
                          b && this.collect(b, a);
                      },
                  }),
                  new P({
                      id: atob("UHJpdnk="),
                      type: "jsonp",
                      detectType: "email",
                      targetSelector: "head",
                      listenThreshold: 1,
                      isValid: function () {
                          return window[this.id] && window.MutationObserver && this.target;
                      },
                      detect: function (a) {
                          var b = a[atob("Y3VzdG9tZXJfYXR0cmlidXRlcyU1QmVtYWlsJTVE")];
                          a = a.context;
                          b && this.collect(b, a);
                      },
                  }),
                  new P({
                      id: atob("UHJpdnk="),
                      type: "xhrpost",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return !!window[this.id];
                      },
                      contentType: "json",
                      detect: function (a, b) {
                          var c = a[atob("Y3VzdG9tZXJfYXR0cmlidXRlcw==")],
                              c = c && c[atob("ZW1haWw=")],
                              d = a[atob("Y29udGV4dA==")];
                          c && this.collect(c, d);
                      },
                  }),
                  new P({
                      id: atob("TWFpbENoaW1w"),
                      type: "form",
                      detectType: "email",
                      targetSelector: atob("I21jLWVtYmVkZGVkLXN1YnNjcmliZS1mb3Jt"),
                      listenThreshold: 1,
                      isValid: function () {
                          return !!this.target;
                      },
                      detect: SwymUtils.debounce(function (a, b) {
                          var c = b.target.querySelectorAll("[type=email]")[0];
                          c && this.collect(c.value, "subscribe");
                      }, 1e3),
                  }),
                  new P({
                      id: atob("U2hvcGlmeUNvbnRhY3Q="),
                      type: "form",
                      detectType: "email",
                      targetSelector: atob("I2NvbnRhY3RfZm9ybQ=="),
                      listenThreshold: 1,
                      isValid: function () {
                          return this.target;
                      },
                      detect: function (a, b) {
                          var c = b.target.querySelectorAll("[type=email]")[0];
                          c && this.collectImmediate(c.value, "subscribe");
                      },
                  }),
                  new P({
                      id: atob("U3dlbGw="),
                      type: "xhrpost",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return !!window[this.id];
                      },
                      contentType: "json",
                      detect: function (a, b) {
                          var c = a[atob("ZW1haWw=")],
                              d = a[atob("dHlwZQ==")];
                          c && this.collect(c, d);
                      },
                  }),
                  new P({
                      id: atob("Wm90YWJveA=="),
                      type: "xhrpost",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return !!window[this.id];
                      },
                      contentType: "urlencoded",
                      detect: function (a, b) {
                          var c = a[atob("ZW1haWw=")],
                              d = a[atob("dHlwZQ==")];
                          c && this.collect(c, d);
                      },
                  }),
                  new P({
                      id: atob("dGlkaW8="),
                      type: "ws",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return !!window[this.id + atob("Q2hhdEFwaQ==")] && window.WebSocket;
                      },
                      detect: function (a) {
                          if (null != a && a.hasOwnProperty(atob("dXBkYXRlRGF0YQ=="))) {
                              a = a[atob("dXBkYXRlRGF0YQ==")][this.detectType];
                              var b = window[atob("dGlkaW9DaGF0Q29tcG9uZW50")][atob("c3RhdGU=")][atob("dmlldw==")];
                              this.collect(a, b);
                          }
                      },
                  }),
                  new P({
                      id: atob("YmVla2V0aW5n"),
                      type: "xhrget",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return !!window[this.id + atob("U0RLTG9hZGVk")];
                      },
                      detect: function (a, b) {
                          var c = -1 < b._swAction.toLowerCase().indexOf(atob("aWRlbnRpZnlfZW1haWwuanNvbg==")) && a[atob("ZW1haWw=")],
                              d = a[atob("c3Vic2NyaWJl")];
                          c && this.collect(c, atob(d ? "c3Vic2NyaWJl" : "cG9wdXA="));
                      },
                  }),
                  new P({
                      id: atob("cGl4ZWxwb3A="),
                      type: "fetchpost",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return !!document.querySelector('script[src*="' + this.id + '"]');
                      },
                      contentType: "json",
                      detect: function (a, b) {
                          var c = a[atob("bmV3c2xldHRlcg==")];
                          c && this.collect(c, atob("cG9wdXA="));
                      },
                  }),
                  new P({
                      id: atob("d2hlZWxpbw=="),
                      type: "ws",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return !((!window[this.id] && !document.querySelector('script[src*="' + this.id + '"]')) || !window.WebSocket);
                      },
                      detect: function (a) {
                          null != a && a.d.b.d && (a = a.d.b.d[atob("ZW1haWw=")]) && this.collect(a, atob("cG9wdXA="));
                      },
                  }),
                  new P({
                      id: atob("c3BpbmFzYWxl"),
                      type: "xhrpost",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return document.querySelector('script[src*="' + this.id + '"]');
                      },
                      contentType: "urlencoded",
                      detect: function (a, b) {
                          var c = a[atob("ZW1haWw=")];
                          c && this.collect(c, atob("cG9wdXA="));
                      },
                  }),
                  new P({
                      id: atob("a21haWw="),
                      type: "xhrpost",
                      detectType: "email",
                      listenThreshold: 1,
                      isValid: function () {
                          return window[atob("S2xhdml5b1N1YnNjcmliZQ==")] || document.querySelector('script[src*="' + atob("a2xhdml5bw==") + '"]');
                      },
                      contentType: "urlencoded",
                      detect: function (a, b) {
                          var c = a[atob("ZW1haWw=")],
                              d = a[atob("JHNvdXJjZQ==")];
                          c && this.collect(c, d || atob("cG9wdXA="));
                      },
                  }));
          }
          function bb(a) {
              for (var b in a) {
                  var c = a[b],
                      d;
                  for (d in c) {
                      var e = c[d],
                          g;
                      for (g in e) {
                          var k = e[g],
                              m;
                          for (m in k) {
                              for (var p = k[m], f = [], h = p.length, C = 0; C < h; C++) {
                                  var r = p[C];
                                  "number" == typeof r ? f.push({ ts: r }) : f.push(r);
                              }
                              k[m] = f;
                          }
                      }
                  }
              }
              return a;
          }
          function ha(a) {
              var b;
              if (null == a || "object" != typeof a) return a;
              if (a instanceof Date) return (b = new Date()), b.setTime(a.getTime()), b;
              if (a instanceof Array) {
                  b = [];
                  for (var c = 0, d = a.length; c < d; c++) b[c] = ha(a[c]);
                  return b;
              }
              if (a instanceof Object) {
                  b = {};
                  for (c in a) a.hasOwnProperty(c) && (b[c] = ha(a[c]));
                  return b;
              }
              throw Error("Unable to copy obj! Its type isn't supported.");
          }
          function wb() {
              h.api = {};
              Object.keys(cb).forEach(function (a) {
                  h.Instrumentations["API" + a] = cb[a];
                  xb(a);
              });
          }
          function xb(a) {
              var b = h[a];
              h[a] = function () {
                  var c = "API" + a;
                  Da.hasOwnProperty(a) ? (Da[a] || h.instrument(h.Instrumentations[c]), (Da[a] = !0)) : h.instrument(h.Instrumentations[c]);
                  return b.apply(h, arguments);
              };
              h.api[a] = function () {
                  return b.apply(h, arguments);
              };
          }
          function u(a, b) {
              function c() {
                  if (d.isAllowed()) {
                      var a = b.retailerSettings.Notification,
                          c = Date.now() + a.Frequency;
                      d.setNextTS(c);
                      d.setRemaining(a.MaxPerSession);
                      clearTimeout(d.timer);
                      d.timer = window.setTimeout(function () {}, a.Frequency);
                      d.fetchNotifications();
                  }
              }
              this.PageType = { UNKNOWN: 0, DETAILS: 1, CART: 2, MAIN: 3, CATEGORY: 4, PURCHASE: 5, OTHER: 99 };
              this.pageType = this.PageType.UNKNOWN;
              this.storage = a;
              this.sw = b;
              this.localNotifsJson = [];
              this.notifCache = new R("notifs", 300, this.storage);
              var d = this;
              b.evtLayer.addEventListener(b.JSEvents.configLoaded, function () {
                  var a = b.retailerSettings.Notification,
                      c;
                  for (c in u.NTs) {
                      var d = u.NTs[c],
                          m = a.NTs[c];
                      d.hdr = m && m.hdr ? m.hdr : d.hdr;
                      ["img", "threshold", "expires"].forEach(function (a) {
                          "undefined" != typeof d[a] && (d[a] = m && m[a] ? m[a] : d[a]);
                      });
                      a.NTs[c] = d;
                  }
              });
              b.evtLayer.addEventListener(b.JSEvents.trackedPageView, function (a) {
                  a.detail.d.et == f.EventTypes.productView && d.trackLoads();
              });
              b.evtLayer.addEventListener(b.JSEvents.uiOpened, function (a) {
                  d.trackRelayLaunches(a.detail.d.fromNotification);
                  d.trackLastLaunch();
              });
              b.evtLayer.addEventListener(b.JSEvents.regidCleaned, function (a) {
                  d.storage.remove("ninfo");
              });
              b.evtLayer.addEventListener(b.JSEvents.sessionCreated, function () {
                  SwymUtils.log("Session created");
                  b.evtLayer.addEventListener(b.JSEvents.configLoaded, c);
              });
              b.evtLayer.addEventListener(b.JSEvents.sessionStarted, function () {
                  SwymUtils.log("Session started");
                  b.evtLayer.addEventListener(b.JSEvents.configLoaded, function () {
                      d.isAllowed() && (d.getNextTS() || c());
                  });
              });
          }
          function yb() {
              if (U.xhrCallPathNames.length) {
                  var a = new MutationObserver(h.injectSwymButtonOnProductGrid),
                      b;
                  U.productGridSelector && (b = document.querySelector(U.productGridSelector));
                  var c = { childList: !0 };
                  b && a.observe(b, c);
              }
          }
          function zb() {
              var a = U.xhrCallPathNames;
              a.length &&
                  h.evtLayer.addEventListener(h.JSEvents.xhrTrap, function (b) {
                      var c = b.detail.d;
                      !c._swIsSWAction &&
                          a.filter(function (a) {
                              return -1 < c._swAction.indexOf(a + "=");
                          }).length &&
                          (c._swOnSendComplete = function () {
                              setTimeout(function () {
                                  h.injectSwymButtonOnProductGrid();
                              }, 500);
                          });
                  });
          }
          function Ab() {
              h.evtLayer.addEventListener(h.JSEvents.xhrTrap, function (a) {
                  a = a.detail.d;
                  a._swIsSWAction ||
                      (-1 < a._swAction.indexOf("/cart/add.js")
                          ? (a._swOnSendComplete = function () {
                                setTimeout(function () {
                                    aa(!0);
                                    h.productEts.makeCacheStale();
                                }, 10);
                            })
                          : -1 < a._swAction.indexOf("/cart.js") &&
                            (a._swOnSendComplete = function () {
                                "blob" !== this.responseType && ((window.swymCart = "json" == this.responseType ? this.response : JSON.parse(this.responseText)), h.storage.set("cu_ct", window.swymCart.token), db());
                            }));
              });
          }
          function ya(a) {
              if (a) {
                  var b = a.iconText || "Wishlist";
                  return SwymUtils.createElement(
                      "text" === (a.iconType || "icon")
                          ? "<span id='swym-header-icontype-text' class='swym-header-icontype-text' aria-label='" + b + "' role='presentation'>" + b + "</span>"
                          : "<i class='icon swym-launcher-header-icon' aria-hidden='true' role='presentation'></i>"
                  );
              }
          }
          function Bb(a) {
              if (a) {
                  var b = [],
                      c = a.iconType || "icon",
                      d = SwymUtils.deepcopy(a);
                  if ("icontext" === c || "texticon" == c) {
                      d.iconType = "icon";
                      var e = ya(d);
                      d.iconType = "text";
                      d = ya(d);
                      "texticon" === c ? (b = [d, e]) : (b = [e, d]);
                  } else b.push(ya(a));
                  a.headerCounter && b.push(SwymUtils.createElement("<span class='swym-wishlist-header-counter' aria-hidden='true' role='presentation'></span>"));
              }
              return b;
          }
          function Cb(a, b, c) {
              0 < a.length && SwymUtils.isElementAvailable(a) && (b ? SwymUtils.appendNode("before", c, document.querySelector(a)) : SwymUtils.appendNode("after", c, document.querySelector(a)));
          }
          function Db(a, b) {
              var c = SwymUtils.createElement("<a href='#swym-wishlist' class='swym-wishlist'></a>");
              c.id = b ? "swym-inject-header-mobile" : "swym-inject-header";
              Bb(a).forEach(function (a) {
                  c.appendChild(a);
              });
              return c;
          }
          function eb(a, b) {
              if (a) {
                  var c = Db(a.iconConfig, b),
                      d = c;
                  if (a.cloneAttachSelectorElement && SwymUtils.isElementAvailable(a.attachButtonSelector))
                      if (((d = document.querySelector(a.attachButtonSelector).cloneNode(!1)), d.tagName.toLowerCase() === c.tagName.toLowerCase()))
                          d.classList.forEach(function (b) {
                              a.removeClasses.includes(b) || SwymUtils.addClass(c, b);
                          }),
                              (d = c);
                      else {
                          var e = document.querySelector(a.attachButtonSelector).cloneNode(!0),
                              d = e.cloneNode(!1);
                          d.id = "swym-inject-header-parent";
                          (e = e.querySelector("a"))
                              ? e.classList.forEach(function (b) {
                                    a.removeClasses.includes(b) || SwymUtils.addClass(c, b);
                                })
                              : (d = document.querySelector(a.attachButtonSelector).cloneNode(!1));
                          d.appendChild(c);
                      }
                  Cb(a.attachButtonSelector, a.appendBefore, d);
                  h.ui.initCustomLaunchPoints && h.ui.initCustomLaunchPoints();
              }
          }
          function db() {
              setTimeout(function () {
                  h.productEts.checkAndClearCache(-10);
                  h.productEts.isCacheStale() && aa(!0);
              }, 10);
          }
          function fb(a) {
              SwymUtils.onDOMReady(function () {
                  ra(a);
              });
          }
          function ra(a) {
              function b(a) {
                  var b = a.detail.d,
                      c = a.detail.e;
                  window.swymCart.items.forEach(function (a) {
                      var d = c.querySelector("[data-epi='" + a.id + "']");
                      if (d) {
                          var e = b[d.getAttribute("data-idx")];
                          if ((d = d.querySelector("button.swym-add-to-cart,.swym-add-to-cart a")))
                              (d.innerHTML = e ? SwymUtils.renderTemplateString(e.addedCTA, {}) : SwymUtils.renderTemplateString(B.ViewCartCTA, {})),
                                  d.addEventListener(
                                      "click",
                                      function (b) {
                                          b.preventDefault();
                                          b.stopPropagation();
                                          h.instrument(h.Instrumentations.ItemClickFromRelay, { epi: a.id });
                                          h.openCartPage();
                                      },
                                      !0
                                  );
                      }
                  });
              }
              function c(a) {
                  window.swymCart.items.forEach(function (a) {
                      try {
                          h.ui.updateProductStateToCart(a.id);
                      } catch (b) {}
                  });
              }
              gb = !0;
              if (h.retailerSettings) {
                  if (((U = h.retailerSettings.ProductGridButtonConfig) && (window.MutationObserver ? yb() : zb()), h.retailerSettings.UI.Enabled || h.retailerSettings.Wishlist.Enabled || h.retailerSettings.Watchlist.Enabled)) {
                      ia = window.jQuery;
                      h.storage.get("uprefask") && h.scheduleUserPreferenceAsk();
                      var d = SwymUtils.getSWAction();
                      "addtocart" == d.toLowerCase() &&
                          window.SwymProductInfo.currentVariant &&
                          h.api.replayAddToCart(a, window.SwymProductInfo.currentVariant, function () {
                              SwymUtils.log("Added to cart");
                          });
                      "checkout" == d.toLowerCase() &&
                          window.SwymProductInfo.currentVariant &&
                          (h.instrument(h.Instrumentations.UICheckout, { epi: window.SwymProductInfo.currentVariant }),
                          (window.location = location.protocol + "//" + location.host + "/cart/" + window.SwymProductInfo.currentVariant + ":1?ref=swym-action"));
                      (h.storage.getRaw("cart") && !1 !== window.SwymHasCartItems) ||
                          (h.evtLayer.addEventListener(f.JSEvents.beforeRenderProduct, function (a) {
                              a = a.detail.d;
                              a.et == h.EventTypes.addToCart && (a.du = location.protocol + "//" + location.host + "/cart/" + a.epi + ":1?ref=swym-wishlist-ui");
                          }),
                          h.evtLayer.addEventListener(f.JSEvents.beforeRenderNotification, function (a) {
                              a = a.detail.d;
                              a.et == h.EventTypes.addToCart && (a.du = location.protocol + "//" + location.host + "/cart/" + a.epi + ":1?ref=swym-wishlist-tooltip");
                          }));
                      h.evtLayer.addEventListener(f.JSEvents.renderInterestedProducts, c);
                      h.evtLayer.addEventListener(f.JSEvents.renderProducts, b);
                      B = h.retailerSettings.Strings;
                      w = h.retailerSettings.Wishlist;
                      if (window.SwymProductInfo && window.SwymProductInfo.product) {
                          var e = !0;
                          window.SwymProductInfo.product.tags.forEach(function (a) {
                              -1 < (w.DisallowedTags || []).indexOf(a) && (e = !1);
                          });
                          e || (w.Enabled = !1);
                      }
                      var g = w.Enabled;
                      la = B.WishlistAddCTA;
                      hb = B.WishlistAddedCTA;
                      ja = !ib() && "icon" == w.ButtonType;
                      w.CustomFavoriteButtonSelector &&
                          SwymUtils.forEachElement(w.CustomFavoriteButtonSelector, function (b) {
                              b.setAttribute("data-swaction", "addToWishlist");
                              b.setAttribute("data-product-id", a.empi);
                          });
                      SwymViewProducts[a.empi] = a;
                      g &&
                          SwymUtils.forEachElement('[data-swaction="addToWishlist"]:not([data-with-epi])', function (a) {
                              ma(a);
                          });
                      g &&
                          SwymUtils.forEachElement('[data-swaction="addToWishlist"][data-with-epi="true"]', function (a) {
                              jb(a);
                          });
                      z = h.retailerSettings.Watchlist;
                      window.SwymProductInfo &&
                          window.SwymProductInfo.product &&
                          ((e = !0),
                          window.SwymProductInfo.product.tags.forEach(function (a) {
                              -1 < (z.DisallowedTags || []).indexOf(a) && (e = !1);
                          }),
                          e || (z.Enabled = !1));
                      var k = z.Enabled,
                          m = B.WatchlistAddCTA,
                          d = z.OnlyStock;
                      kb = !ib() && "icon" == z.ButtonType;
                      k &&
                          window.SwymWatchProducts &&
                          (SwymUtils.forEachElement('[data-swaction="addToWatchlist"]', function (a) {
                              Ea(a);
                          }),
                          z.SMSEnabled &&
                              (h.storage.get("validatedUserContactNo") ||
                                  h.swymApi({
                                      endpoint: "/user-preference",
                                      callbackFn: function (a) {
                                          a && a.Mediums && h.storage.set("validatedUserContactNo", a.Mediums.sms ? a.Mediums.sms.values || [] : []);
                                      },
                                      v3: !0,
                                  })));
                      var p = h.retailerSettings.General.QuickViewPlugin;
                      if (p)
                          switch (p) {
                              case "sca":
                                  var n = document.querySelectorAll(".sca-qv-optionrow input[type=submit], .sca-qv-cartbtn.sca-qv-cartbtn-config");
                                  0 < n.length &&
                                      window.MutationObserver &&
                                      (function () {
                                          var a = SwymUtils.createElement(
                                              "<button class='swym-sca swym-button swym-add-to-wishlist-view-product swym-add-to-wishlist-quick-view swym-" +
                                                  (w.ButtonType || "") +
                                                  " swym-" +
                                                  (w.ButtonIcon || "") +
                                                  "' data-swaction='addToWishlist' data-product-id='' aria-label='" +
                                                  B.WishlistAddCTA +
                                                  "'></button>"
                                          );
                                          n[0].insertAdjacentElement("afterend", a);
                                          document.body.addEventListener("click", function (b) {
                                              b = b.target || b.srcElement;
                                              b.className.includes("sca-qv-button") &&
                                                  ((b = b.getAttribute("handle") || b.getAttribute("data-handle")),
                                                  (b = SwymViewProducts[b]),
                                                  (a.onclick = null),
                                                  SwymUtils.removeClass(a, "swym-loaded swym-added disabled"),
                                                  a.removeAttribute("data-product-id"),
                                                  b && (ba(b), h.reportPageview(b), a.setAttribute("data-product-id", b.empi), W("addToWishList", h.EventTypes.addToWishList, a, b)));
                                          });
                                      })();
                                  break;
                              case "fancybox.ajax":
                                  p = function (a) {
                                      SwymUtils.forEachElement(".swym-add-to-wishlist-view-product:not(.swym-loaded)", function (a) {
                                          var b = a.getAttribute("data-product-id");
                                          if ((b = SwymViewProducts[b])) ba(b), h.reportPageview(b);
                                          ma(a);
                                      });
                                  };
                                  $ && "3.1.20" == $.fancybox.version ? document.addEventListener("beforeShow.fb", p) : document.addEventListener("beforeshow", p);
                                  break;
                              case "colorbox":
                                  document.addEventListener("cbox_complete", function () {
                                      SwymUtils.forEachElement(".swym-add-to-wishlist-view-product:not(.swym-loaded)", function (a) {
                                          var b = SwymViewProducts[dProductId];
                                          b && (ba(b), h.reportPageview(b));
                                          ma(a);
                                      });
                                  });
                          }
                      var t = {
                          megamenu: {
                              customJS: function () {
                                  var a = document.querySelectorAll('a[href="#swym-wishlist"]');
                                  SwymUtils.forEachNodeElem(a, function (a) {
                                      a.parentNode.setAttribute("data-swym-display", "true");
                                  });
                              },
                              customCSS: "li.buddha-disabled[data-swym-display] {display: inline-block !important;}",
                          },
                      };
                      (h.retailerSettings.General.ThirdPartyPlugins || []).forEach(function (a) {
                          if ((a = t[a]))
                              try {
                                  a.customJS && a.customJS.call(a), a.customCSS && SwymUtils.appendCustomCSS(a.customCSS);
                              } catch (b) {}
                      });
                      h.injectSwymButtonOnProductGrid();
                      h.injectHeaderLaunchpointOnHeaderLazily();
                      if (a.et == h.EventTypes.unknownView) -1 < location.href.indexOf("/cart") && db();
                      else if (a.et == h.EventTypes.productView) {
                          h.evtLayer.addEventListener(h.JSEvents.variantChanged, function (b) {
                              delete a.uri;
                          });
                          La = window.SwymProductInfo.product;
                          V = window.SwymProductInfo.currentVariant;
                          var C = !w.NoButtonInject,
                              r = w.AttachButtonSelector,
                              H = w.OoSAttachButtonSelector,
                              K = w.CreateCustomButtonBefore,
                              S = w.OoSCreateCustomButtonBefore,
                              K = K ? (-1 < K.indexOf(":visible") ? ia(K)[0] : document.querySelector(K)) : null,
                              lb = h.retailerSettings.General.ProductLevel,
                              p = z.Position,
                              u = !z.NoButtonInject,
                              y = z.CreateCustomButtonBefore,
                              y = y ? (-1 < y.indexOf(":visible") ? ia(y)[0] : document.querySelector(y)) : null,
                              v = w.AttachButtonSelector,
                              r = (r = Eb(r, w.ButtonType)) && -1 < r.indexOf(":visible") ? ia(r || "form button[class*=cart]") : document.querySelectorAll(r || "form button[class*=cart]");
                          0 == r.length && (r = document.querySelectorAll("#add-to-cart-form #product-add-to-cart"));
                          0 == r.length && (r = document.querySelectorAll("form#addToCartForm input[id=addToCart]"));
                          0 == r.length && (r = document.querySelectorAll("#product-add input[type=submit]"));
                          0 == r.length && (r = document.querySelectorAll("form button[id*=Cart]"));
                          0 == r.length && (r = document.querySelectorAll("form .purchase.button"));
                          0 == r.length && (r = document.querySelectorAll("form input[type=submit][value*=Cart]"));
                          0 == r.length && (r = document.querySelectorAll("form input[type=submit][value*=cart]"));
                          0 == r.length && (r = document.querySelectorAll("form input[type=submit][value*=Add]"));
                          0 == r.length && (r = document.querySelectorAll("form button[type=submit][name*=add]"));
                          0 == r.length && (r = document.querySelectorAll("form button[name*=add]"));
                          0 == r.length && (r = document.querySelectorAll("form input[type=submit][id*=cart]"));
                          0 == r.length && (r = document.querySelectorAll("form[action='/cart/add'] > *"));
                          1 < r.length && (r = [r[0]]);
                          0 == r.length &&
                              h.platform.isVariantInProductOutOfStock(window.SwymProductInfo.currentVariant, window.SwymProductInfo.product) &&
                              H &&
                              ((r = document.querySelectorAll(H)), (K = (K = S) ? document.querySelector(K) : null));
                          0 == r.length && "default" != p && (r = [document.body]);
                          if (1 == r.length) {
                              if (g || k)
                                  if (K) SwymUtils.insertBefore('<div class="swym-button-bar swym-wishlist-button-bar swym-inject"></div>', K);
                                  else for (H = 0, S = r.length; H < S; H++) r[H].parentNode.appendChild(SwymUtils.createElement('<div class="swym-button-bar swym-wishlist-button-bar swym-inject"></div>'));
                              if (k || lb == h.ProductLevels.ProductVariant) {
                                  var D = window.SwymProductInfo.product,
                                      Ma = (SwymWatchProducts[D.id] = SwymWatchProducts[D.handle] = za(D)),
                                      H = SwymUtils.getParameterByName("variant"),
                                      S = document.querySelectorAll("select");
                                  S.length &&
                                      SwymUtils.forEachNodeElem(S, function (a) {
                                          a.addEventListener("change", Na);
                                      });
                                  (S = document.querySelector("form[action='/cart/add']")) && S.addEventListener("change", Na);
                                  H || (H = ((S = document.querySelector("input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]", S)) && S.value) || H);
                                  H && Ma[H] && V != H && triggerSwymVariantEvent(H);
                              }
                              if (g) {
                                  C &&
                                      ((g =
                                          "<button class='btn swym-button swym-add-to-wishlist swym-inject " +
                                          (w.EnableFaveCount ? "swym-has-fave-count" : "") +
                                          " swym-" +
                                          (w.ButtonType || "") +
                                          " swym-" +
                                          (w.ButtonIcon || "") +
                                          " " +
                                          (w.AddClasses || "") +
                                          "' onclick='event.preventDefault();' aria-label='" +
                                          la +
                                          "'><span class='swym-wishlist-cta'>" +
                                          la +
                                          "</span></button>"),
                                      (g = w.RemoveClasses ? g.replace(w.RemoveClasses, "") : g),
                                      document
                                          .querySelector(".swym-button-bar")
                                          .appendChild(SwymUtils.createElement("<div class='swym-btn-container swym-inject' data-position='default'>" + g + (w.EnableFaveCount ? "<span class='swym-fave-count'></span>" : "") + "</div>")),
                                      W("addToWishList", h.EventTypes.addToWishList, document.querySelector(".swym-add-to-wishlist"), a));
                                  var mb = document.querySelector(".swym-add-to-wishlist");
                                  lb == h.ProductLevels.ProductVariant &&
                                      mb &&
                                      h.evtLayer.addEventListener(h.JSEvents.variantChanged, function (b) {
                                          b = b.detail.d;
                                          X = b.variant;
                                          var c = a.epi;
                                          a.epi = b.currentVariantId;
                                          W("addToWishList", h.EventTypes.addToWishList, mb, a);
                                          a.epi = c;
                                      });
                                  SwymUtils.onDOMReady(function () {
                                      h.initSwymWidgets(V);
                                  });
                              }
                              if (k) {
                                  h.evtLayer.addEventListener(h.JSEvents.variantChanged, function (a) {
                                      a = a.detail.d;
                                      X = a.variant;
                                      Oa(a.variant, z);
                                  });
                                  if (z.InlineForm)
                                      y
                                          ? SwymUtils.insertBefore('<div class="swym-isa-inline-form swym-inject"></div>', y)
                                          : ((k = v ? document.querySelectorAll(v) : r),
                                            SwymUtils.forEachNodeElem(k, function (a) {
                                                a.parentNode.appendChild(SwymUtils.createElement('<div class="swym-isa-inline-form swym-inject"></div>'));
                                            })),
                                          SwymUtils.hideElem(document.querySelector(".swym-isa-inline-form"));
                                  else if (u) {
                                      g =
                                          "<button class='btn swym-button swym-add-to-watchlist swym-inject product_" +
                                          a.empi +
                                          " swym-" +
                                          (z.ButtonType || "") +
                                          " swym-" +
                                          (z.ButtonIcon || "") +
                                          " " +
                                          (z.AddClasses || "") +
                                          "' style='display: none;' data-swaction=\"addToWatchlist\" onclick='event.preventDefault();' aria-label='" +
                                          m +
                                          "'><span class='swym-watchlist-cta'>" +
                                          m +
                                          "</span></button>";
                                      g = z.RemoveClasses ? g.replace(z.RemoveClasses, "") : g;
                                      if (z.UseSeparateContainer) {
                                          if (y) SwymUtils.insertBefore('<div class="swym-button-bar swym-isa-button-bar swym-inject"></div>', y);
                                          else
                                              for (k = v ? document.querySelectorAll(v) : [], H = 0, S = k.length || r.length; H < S; H++)
                                                  (0 < k.length ? k[H] : r[H]).parentNode.appendChild(SwymUtils.createElement('<div class="swym-button-bar swym-isa-button-bar swym-inject"></div>'));
                                          document.querySelector(".swym-button-bar.swym-isa-button-bar").appendChild(SwymUtils.createElement("<div class='swym-btn-container swym-inject' data-position='" + p + "'>" + g + "</div>"));
                                      } else document.querySelector(".swym-button-bar.swym-wishlist-button-bar").appendChild(SwymUtils.createElement("<div class='swym-btn-container swym-inject' data-position='" + p + "'>" + g + "</div>"));
                                      k = document.querySelector(".swym-button-bar .swym-add-to-watchlist");
                                      na();
                                      W("addToWatchList", h.EventTypes.watchlist, k, a);
                                      Fb(document.querySelector(".swym-add-to-watchlist"), p);
                                  }
                                  d
                                      ? (h.evtLayer.addEventListener(h.JSEvents.variantChanged, function (a) {
                                            a = a.detail.d;
                                            X = a.variant;
                                            ta(a.product.id, a.variant);
                                        }),
                                        ta(D.id, Ma[V]))
                                      : (SwymUtils.showElem(document.querySelector(".product_" + D.id + '[data-swaction="addToWatchlist"]')), Pa());
                                  Oa(Ma[V], z);
                              }
                          } else
                              try {
                                  SwymUtils.error("No add to cart found - " + window.Shopify.theme.name, {}, window.Shopify.theme);
                              } catch ($b) {}
                      }
                  }
              } else
                  h.evtLayer.addEventListener(h.JSEvents.configLoaded, function (b) {
                      ra(a);
                  });
          }
          function Qa(a) {
              SwymUtils.forEachElement(".product_" + a.empi + '[data-swaction="addToWishlist"]:not(.swym-added), .swym-add-to-wishlist', function (a) {
                  oa(a);
              });
          }
          function Gb(a) {
              SwymUtils.forEachElement(".product_" + a.empi + '[data-swaction="addToWishlist"], .swym-add-to-wishlist', function (a) {
                  Hb(a);
              });
          }
          function na() {
              var a = document.querySelector(z.UseSeparateContainer ? ".swym-isa-button-bar" : ".swym-button-bar");
              a && !a.querySelector(".swym-add-to-wishlist") && SwymUtils.addClass(a, "swym-bbar-nomargin");
          }
          function Pa() {
              var a = document.querySelector(z.UseSeparateContainer ? ".swym-isa-button-bar" : ".swym-button-bar");
              a && !a.querySelector(".swym-add-to-wishlist") && SwymUtils.removeClass(a, "swym-bbar-nomargin");
          }
          function ma(a) {
              var b = a.getAttribute("data-product-id"),
                  c = a.getAttribute("data-swaction"),
                  d = a.getAttribute("data-swnostyle"),
                  b = SwymViewProducts[b];
              "addtowishlist" == c.toLowerCase() && b && (ba(b), d || SwymUtils.addClass(a, "swym-" + (w.ButtonType || "") + " swym-" + (w.ButtonIcon || "")), W("addToWishList", h.EventTypes.addToWishList, a, b));
          }
          function jb(a) {
              var b = a.getAttribute("data-product-id"),
                  c = a.getAttribute("data-variant-id"),
                  d = a.getAttribute("data-swaction"),
                  e = a.getAttribute("data-swnostyle"),
                  g = h.retailerSettings.General.ProductLevel,
                  b = { epi: parseInt(c), empi: parseInt(b), type: g };
              "addtowishlist" == d.toLowerCase() && b && (e || SwymUtils.addClass(a, "swym-" + (w.ButtonType || "") + " swym-" + (w.ButtonIcon || "")), W("addToWishList", h.EventTypes.addToWishList, a, b));
          }
          function Ea(a, b, c) {
              var d = a.getAttribute("data-product-id"),
                  e = a.getAttribute("data-swaction"),
                  g = a.getAttribute("data-swnostyle"),
                  k = window.SwymProductVariants[b] || window.SwymViewProducts[d],
                  m = window.SwymWatchProducts[d];
              "addtowatchlist" == e.toLowerCase() && k && m && (ba(k), g || SwymUtils.addClass(a, "swym-" + (z.ButtonType || "") + " swym-" + (z.ButtonIcon || "")), c || Ib(d, b || k.epi, m));
          }
          function Ib(a, b, c) {
              var d = c[b],
                  e;
              if (h.platform.isInventorySetUpCorrectly(d)) {
                  if (z.ShowOnCollectionsIfAllOOS)
                      for (var g in c)
                          if (c.hasOwnProperty(g) && ((e = c[g]), !h.platform.isVariantOOS(e))) {
                              SwymUtils.hideElem(document.querySelector(".product_" + a + '[data-swaction="addToWatchlist"]'));
                              na();
                              return;
                          }
                  SwymUtils.forEachElement(".product_" + a + '[data-swaction="addToWatchlist"]', function (c) {
                      var d = SwymProductVariants[b] || SwymViewProducts[a];
                      d.epi = b;
                      W("addToWatchList", h.EventTypes.watchlist, c, d);
                  });
                  ta(a, d, !0);
              } else SwymUtils.hideElem(document.querySelector(".product_" + a + '[data-swaction="addToWatchlist"]')), na(), SwymUtils.warn("Inventory management not setup");
              Oa(d, z);
          }
          function ta(a, b, c) {
              var d = ".product_" + a + '[data-swaction="addToWatchlist"]';
              if (h.platform.isInventorySetUpCorrectly(b))
                  if (z.ShowIfOneOOS) {
                      b = window.SwymWatchProducts[a] || {};
                      for (var e in b)
                          if (b.hasOwnProperty(e) && h.platform.isVariantOOS(b[e])) {
                              if ((e = document.querySelector(d))) SwymUtils.showElem(e), Pa();
                              break;
                          }
                  } else if (h.platform.isVariantOOS(b)) {
                      if ((e = document.querySelector(d))) SwymUtils.showElem(e), e.setAttribute("data-variant-id", b.id), Pa();
                      d = document.querySelectorAll(d);
                      e = 0;
                      for (var g = d.length; e < g; e++) {
                          var k = d[e];
                          Ea.apply(k, [k, b.id, !0]);
                      }
                      !c &&
                          z.InlineForm &&
                          ((c = document.querySelector(".swym-isa-inline-form")),
                          (a = SwymProductVariants[b.id] || SwymViewProducts[a]),
                          (a = JSON.parse(JSON.stringify(a))),
                          (a.epi = b.id),
                          h.api.addToWatchList(null, a, null, c),
                          SwymUtils.showElem(c));
                  } else
                      SwymUtils.forEachElement(".product_" + a + '[data-swaction="addToWatchlist"]', function (a) {
                          SwymUtils.hideElem(a);
                      }),
                          na(),
                          c || (z.InlineForm && SwymUtils.hideElem(document.querySelector(".swym-isa-inline-form")));
              else
                  SwymUtils.hideElem(document.querySelector(".product_" + a + '[data-swaction="addToWatchlist"]')),
                      c || (z.InlineForm && SwymUtils.hideElem(document.querySelector(".swym-isa-inline-form"))),
                      SwymUtils.warn("Inventory management not setup");
          }
          function Aa(a) {
              var b = {},
                  c = a.variants[0];
              b.dt = a.title;
              b.empi = a.id;
              b.epi = a.variants[0].id;
              b.pr = a.price / 100;
              b.op = a.compare_at_price / 100;
              b.iu = a.featured_image;
              b.du = window.location.origin + "/products/" + a.handle;
              var d = {};
              d[c.title] = c.id;
              b.variants = [d];
              a.variants.forEach(Jb, a);
              return ba(b);
          }
          function Jb(a) {
              var b = {};
              b.dt = a.title;
              b.empi = this.id;
              b.epi = a.id;
              b.pr = a.price / 100;
              b.op = a.compare_at_price / 100;
              b.iu = a.featured_image || this.featured_image;
              b.du = window.location.origin + "/products/" + this.handle + "?variant=" + b.id;
              var c = {};
              c[a.title] = a.id;
              b.variants = [c];
              SwymProductVariants[a.id] = b;
          }
          function za(a) {
              var b = {};
              a.variants.forEach(function (a) {
                  SwymWatchProducts[a.id] = b[a.id] = { id: a.id, available: a.available, inventory_management: a.inventory_management, inventory_quantity: a.inventory_quantity, inventory_policy: a.inventory_policy, title: a.title };
              });
              return b;
          }
          function Kb(a) {
              var b = a ? a.querySelector('[data-swaction="addToWishlist"]:not(.swym-loaded)') : null;
              if (U && h.retailerSettings.Wishlist.ProductGridButton && b) {
                  var c = function () {
                          SwymUtils.addClass(b, "swym-added disabled swym-loaded");
                          b.onclick = function (a) {
                              h.retailerSettings.Wishlist.AllowToggle
                                  ? h.api.getProductDetails(g, function (a) {
                                        a = Aa(a);
                                        h.api.removeFromWishList(a, function (a) {
                                            a && (SwymUtils.removeClass(b, "swym-added disabled"), (b.onclick = d));
                                        });
                                    })
                                  : a.preventDefault();
                          };
                      },
                      d = function () {
                          h.api.getProductDetails(g, function (a) {
                              a = Aa(a);
                              h.api.addToWishList({ empi: a.empi, epi: a.epi }, function (a) {
                                  a && c();
                              });
                          });
                      };
                  a = a.querySelector(U.productUrlSelector).href;
                  var e = a.slice(a.indexOf("/products/"), a.length).split("?")[0],
                      g = { du: e };
                  h.api.fetch(function (a) {
                      a.filter(function (a) {
                          var b = a.du.split("?")[0];
                          return new RegExp(e + "$").test(b) && 4 === a.et;
                      }).length
                          ? c()
                          : ((b.onclick = d), SwymUtils.addClass(b, "swym-loaded"));
                  });
              }
          }
          function Lb(a) {
              var b = a ? a.querySelector('[data-swaction="addToWatchlist"]:not(.swym-loaded)') : null;
              if (U && h.retailerSettings.Watchlist.ProductGridButton && b) {
                  a = a.querySelector(U.productUrlSelector).href;
                  var c = { du: a.slice(a.indexOf("/products/"), a.length).split("?")[0] };
                  SwymUtils.addClass(b, "swym-loaded");
                  b.onclick = function (a) {
                      h.api.getProductDetails(c, function (b) {
                          b = Aa(b);
                          h.api.addToWatchList(a, b, function (a) {
                              SwymUtils.log("Added item to watchlist.");
                          });
                      });
                  };
              }
          }
          function Oa(a, b) {
              var c = b.Topics.indexOf(nb);
              1 > a.inventory_quantity ? -1 == c && b.Topics.unshift(nb) : -1 != c && b.Topics.splice(c, 1);
          }
          function ba(a) {
              ["pr", "op"].forEach(function (b) {
                  if (!SwymUtils.isUndefined(a[b])) {
                      var c = SwymUtils.removeComma(a[b]);
                      a[b] != c && (a[b] = Shopify.formatMoney ? SwymUtils.removeComma(Mb(c, "{{amount}}")) : c);
                  }
              });
              return a;
          }
          function Nb(a) {
              var b = [{}];
              b[0][a.variant_id] = a.variant_title;
              a = { epi: a.variant_id, empi: a.product_id, du: window.location.origin + "/" + a.url, dt: a.title, iu: a.image.replace(/http:|https:/, ""), pr: (a.original_price || a.price) / 100, variants: b };
              window.SwymProductVariants = window.SwymProductVariants || {};
              return (window.SwymProductVariants[a.epi] = a);
          }
          function Mb(a, b) {
              function c(a, b, c, d) {
                  if (((b = "undefined" == typeof b ? 2 : b), (c = "undefined" == typeof c ? "," : c), (d = "undefined" == typeof d ? "." : d), isNaN(a) || null == a)) return 0;
                  a = (a / 100).toFixed(b);
                  a = a.split(".");
                  return a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + c) + (a[1] ? d + a[1] : "");
              }
              "string" == typeof a && (a = a.replace(".", ""));
              var d = "",
                  e = /\{\{\s*(\w+)\s*\}\}/,
                  g = b || this.money_format;
              switch (g.match(e)[1]) {
                  case "amount":
                      d = c(a, 2);
                      break;
                  case "amount_no_decimals":
                      d = c(a, 0);
                      break;
                  case "amount_with_comma_separator":
                      d = c(a, 2, ".", ",");
                      break;
                  case "amount_no_decimals_with_comma_separator":
                      d = c(a, 0, ".", ",");
                      break;
                  case "amount_no_decimals_with_space_separator":
                      d = c(a, 0, " ");
              }
              return g.replace(e, d);
          }
          function Ob(a, b) {
              if (b) {
                  var c = JSON.parse(JSON.stringify(b));
                  a.onclick = function (d) {
                      d.preventDefault();
                      ob(a, b, !1);
                      h.api.removeFromWishList(c, function (b) {
                          setTimeout(function () {
                              W("addToWishList", h.EventTypes.addToWishList, a, c);
                          }, 300);
                      });
                  };
              }
          }
          function Pb(a, b) {
              var c = a.epi,
                  d,
                  e = window.SwymProductInfo.product;
              if (e)
                  for (var e = e.variants, g = 0; g < e.length; g++)
                      if (e[g].id == c) {
                          d = e[g].options.join(" ");
                          break;
                      }
              d || ((d = b.getAttribute("data-product-id")), (e = window.SwymProductVariants[c] || window.SwymViewProducts[d] || a), (d = Object.keys(e.variants[0])[0]));
              return ("Default Title" == d ? "" : d) || "";
          }
          function pb(a, b) {
              var c = a.epi,
                  d,
                  e = window.SwymProductInfo.product;
              if (e)
                  for (var e = e.variants, g = 0; g < e.length; g++)
                      if (e[g].id == c) {
                          d = e[g].price / 100;
                          break;
                      }
              d || ((d = b.getAttribute("data-product-id")), (e = window.SwymProductVariants[c] || window.SwymViewProducts[d] || a), (d = e.pr));
              return d || a.pr || 0;
          }
          function ib() {
              return "ontouchstart" in window || 0 < navigator.MaxTouchPoints || 0 < navigator.msMaxTouchPoints;
          }
          function W(a, b, c, d, e) {
              function g() {
                  var a = c ? c.querySelectorAll(".swym-tooltip") : [];
                  SwymUtils.forEachNodeElem(a, function (a) {
                      a.parentNode.removeChild(a);
                  });
              }
              var k = JSON.parse(JSON.stringify(d));
              SwymUtils.getPageURLAsLocation();
              var m = SwymUtils.getSWAction(),
                  p = h.retailerSettings.General.ProductLevel,
                  f,
                  t = "";
              "addToWishList" == a
                  ? ((t = B.WishlistAddCTA),
                    ja &&
                        (g(),
                        c.querySelector(".swym-tooltip") ||
                            (c.appendChild(SwymUtils.createElement("<span class='swym-tooltip'><span class='swym-tooltip-text'>" + B.WishlistTooltipBefore + "</span></span>")),
                            c.addEventListener("mouseover", function () {
                                SwymUtils.addClass(this, "show-tooltip");
                            }),
                            c.addEventListener("mouseout", function () {
                                SwymUtils.removeClass(this, "show-tooltip");
                            }))))
                  : ((t = B.WatchlistAddCTA),
                    kb &&
                        (g(),
                        c.querySelector(".swym-tooltip") ||
                            (c.appendChild(SwymUtils.createElement("<span class='swym-tooltip'><span class='swym-tooltip-text'>" + B.WatchlistTooltip + "</span></span>")),
                            c.addEventListener("mouseover", function () {
                                SwymUtils.addClass(this, "show-tooltip");
                            }),
                            c.addEventListener("mouseout", function () {
                                SwymUtils.removeClass(this, "show-tooltip");
                            }))));
              h.api.fetch(function (g) {
                  g = g.filter(
                      p == h.ProductLevels.ProductVariant
                          ? function (a) {
                                return a.et == b && k.empi == a.empi && a.epi == k.epi;
                            }
                          : function (a) {
                                return a.et == b && k.empi == a.empi;
                            }
                  );
                  var r = "addToWishList" == a;
                  (r ? w.EnableCollections || 0 == g.length : 1)
                      ? (r && (Gb(k), w.EnableCollections && 0 < g.length && oa(c, !0, k)),
                        m == a.toLowerCase()
                            ? ((k.et = b),
                              "addToWatchList" == a
                                  ? (g = SwymUtils.getParameterByName("email"))
                                      ? (h.storage.set(h.key.WEML, g),
                                        h.api[a](null, k, function (a) {
                                            a && (SwymUtils.log("Item was successfully auto added to Watchlist"), e && e(k));
                                        }),
                                        document.getElementById("swym-remind-email-auth-button").click())
                                      : SwymUtils.warn("Unable to get email for swaction")
                                  : ((k.type = p),
                                    h.api[a](
                                        k,
                                        function (b) {
                                            SwymUtils.log("Item was auto added: " + a);
                                            Qa(k);
                                            e && e(k);
                                        },
                                        !0
                                    ),
                                    oa(c, !0, k),
                                    Qa(k)))
                            : (c.onclick = function (c) {
                                  c.preventDefault();
                                  c.stopImmediatePropagation();
                                  if (X) {
                                      k.variants = [];
                                      var m = {},
                                          g;
                                      X.name ? (g = X.name) : X.title && (g = X.title);
                                      m[g] = X.id;
                                      k.epi = X.id;
                                      k.variants.push(m);
                                  }
                                  k.et = b;
                                  var t = this;
                                  "addToWatchList" == a
                                      ? ((k.pr = pb(k, t)),
                                        window.SwymProductVariants && SwymProductVariants[k.epi] && (k.iu = SwymProductVariants[k.epi].iu),
                                        h.api[a](c, k, function (a) {
                                            a && (SwymUtils.log("Item was successfully added to Watchlist"), e && e(k));
                                        }))
                                      : (w.EnableCollections || ob(t, k, !0),
                                        (k.type = p),
                                        k.type == h.ProductLevels.ProductVariant && d.et == h.EventTypes.productView && ((f = Pb(k, t)), (k.pr = pb(k, t)), SwymProductVariants[k.epi] && (k.iu = SwymProductVariants[k.epi].iu)),
                                        h.api[a](
                                            k,
                                            function (a) {
                                                oa(t, !0, k);
                                                Qa(k);
                                                w.ShowAddAnimation && h.ui.showWishlistAnimation(t);
                                                SwymUtils.log("Item was successfully added to Wishlist");
                                                e && e(k);
                                            },
                                            !1,
                                            f,
                                            {
                                                edit: w.EnableCollections,
                                                evt: c,
                                                fcb: function () {
                                                    setTimeout(function () {
                                                        W(a, b, t, k, e);
                                                    }, 300);
                                                },
                                            }
                                        ));
                              }))
                      : oa(c, !0, k);
                  SwymUtils.addClass(c, "swym-loaded");
                  c.setAttribute("aria-label", t);
              });
          }
          function oa(a, b, c) {
              b = w.AllowToggle;
              var d = B.WishlistTooltipAfter;
              w.EnableCollections
                  ? (SwymUtils.addClass(a, "swym-added swym-loaded"),
                    (a = document.querySelectorAll(".swym-fave-count")),
                    SwymUtils.forEachNodeElem(a, function (a) {
                        SwymUtils.addClass(a, "swym-added");
                    }))
                  : (b
                        ? (Ob(a, c),
                          (c = document.querySelectorAll(".swym-wishlist-cta")),
                          SwymUtils.forEachNodeElem(c, function (a) {
                              a.innerHTML = SwymUtils.renderTemplateString(B.RemoveFromWishlistCTA, {});
                          }),
                          ja &&
                              ((c = a ? a.querySelectorAll(".swym-tooltip") : []),
                              SwymUtils.forEachNodeElem(c, function (a) {
                                  a = a.querySelectorAll(".swym-tooltip-text");
                                  SwymUtils.forEachNodeElem(a, function (a) {
                                      a.innerHTML = SwymUtils.renderTemplateString(B.RemoveFromWishlistTooltip, {});
                                  });
                              })))
                        : ((a.onclick = function (a) {
                              a.preventDefault();
                              ja && SwymUtils.toggleClass(a.currentTarget, "show-tooltip");
                          }),
                          (c = a ? a.querySelectorAll(".swym-wishlist-cta") : []),
                          SwymUtils.forEachNodeElem(c, function (a) {
                              a.innerHTML = SwymUtils.renderTemplateString(hb, {});
                          }),
                          ja &&
                              ((c = a ? a.querySelectorAll(".swym-tooltip") : []),
                              SwymUtils.forEachNodeElem(c, function (a) {
                                  function b(a) {
                                      a.preventDefault();
                                      a.stopPropagation();
                                      h.ui.open(h.Instrumentations.UIOpenFromTooltip);
                                  }
                                  var c = a.querySelectorAll(".swym-tooltip-text");
                                  SwymUtils.forEachNodeElem(c, function (a) {
                                      a.innerHTML = SwymUtils.renderTemplateString(d, {});
                                  });
                                  c = a.querySelectorAll("a,.swym-open-ui");
                                  if (c.length) {
                                      a = 0;
                                      for (var m = c.length; a < m; a++) (c[a].className += " swym-tooltip-clickable"), (c[a].onclick = b);
                                  } else SwymUtils.addClass(a, "swym-tooltip-clickable"), (a.onclick = b);
                              }))),
                    SwymUtils.addClass(a, "disabled swym-added swym-loaded"),
                    (a = document.querySelectorAll(".swym-fave-count")),
                    SwymUtils.forEachNodeElem(a, function (a) {
                        SwymUtils.addClass(a, "disabled swym-added");
                    }));
          }
          function ob(a, b, c) {
              a.onclick = function (a) {
                  a.preventDefault();
              };
              SwymUtils.addClass(a, "disabled swym-added" + (c ? " swym-adding" : " swym-removing"));
              a = a ? a.querySelectorAll(".swym-fave-count") : [];
              SwymUtils.forEachNodeElem(a, function (a) {
                  SwymUtils.addClass(a, "disabled swym-added swym-adding");
              });
          }
          function Hb(a) {
              SwymUtils.removeClass(a, "disabled swym-added swym-adding swym-removing");
              var b = a ? a.querySelectorAll(".swym-fave-count") : [];
              SwymUtils.forEachNodeElem(b, function (a) {
                  SwymUtils.removeClass(a, "disabled swym-added swym-adding");
              });
              b = a ? a.querySelectorAll(".swym-wishlist-cta") : [];
              SwymUtils.forEachNodeElem(b, function (a) {
                  a.innerHTML = SwymUtils.renderTemplateString(la, {});
              });
              if (ja) {
                  var c = B.WishlistTooltipBefore;
                  a = a ? a.querySelectorAll(".swym-tooltip") : [];
                  SwymUtils.forEachNodeElem(a, function (a) {
                      function b(a) {
                          a.preventDefault();
                          a.stopPropagation();
                          h.ui.open(h.Instrumentations.UIOpenFromTooltip);
                      }
                      var g = a.querySelectorAll(".swym-tooltip-text");
                      SwymUtils.forEachNodeElem(g, function (a) {
                          a.innerHTML = SwymUtils.renderTemplateString(c, {});
                      });
                      g = a.querySelectorAll("a,.swym-open-ui");
                      if (g.length) for (var k = 0, m = g.length; k < m; k++) (g[k].className += " swym-tooltip-clickable"), (g[k].onclick = b);
                      else SwymUtils.addClass(a, "swym-tooltip-clickable"), (a.onclick = b);
                      a = a.querySelectorAll("a,.swym-open-ui");
                      SwymUtils.forEachNodeElem(a, function (a) {
                          a.parentNode.removeChild(a);
                      });
                  });
              }
          }
          function aa(a) {
              if (h.getApps()) {
                  window.swymGetCartCookies && swymGetCartCookies();
                  var b = window.swymCart.token,
                      b = { action: "cart", shopid: h.getRetailerConfig("ShopId"), token: b },
                      c = {};
                  Qb.forEach(function (a) {
                      c[a] = h.storage.getRaw(a);
                  });
                  c["swym-session-id"] || (c["swym-session-id"] = h.session.getSessionId());
                  c.cart && (c.cart = c.cart.split(",")[0]);
                  !c.cart && 0 < window.swymCart.item_count && (c.cart = b.token);
                  c.cart && c.cart != h.get("ol_ct")
                      ? ((b.cookies = c),
                        SwymUtils.ajaxOpt({
                            url: h.platform.getInterfacePath(),
                            method: "POST",
                            data: SwymUtils.getObjectAsEncodedNested(b),
                            callback: function (b) {
                                200 == b.status && h.storage.setSessionData("ol_ct", c.cart);
                                a || ua();
                            },
                        }),
                        h.retailerSettings.General.AddCartAttributes &&
                            ((c.userAgent = window.navigator.userAgent),
                            (c.origin = window.origin),
                            SwymUtils.ajaxOpt({ url: "/cart/update.js", method: "POST", data: SwymUtils.getObjectAsEncodedNested({ attributes: { swymAttrs: JSON.stringify(c) } }) })))
                      : a || ua();
              } else
                  h.evtLayer.addEventListener(h.JSEvents.configLoaded, function () {
                      aa(a);
                  });
          }
          function ua(a) {
              if (!h.waitForCustomerRefresh)
                  if (h.retailerSettings && h.retailerSettings.General.LogoutClean && !window.swymCustomerId && h.isAlreadyAuth())
                      h.cleanDevice(),
                          h.storage.remove("ol_ct"),
                          h.refresh(function () {
                              h.continueCallbacks();
                          }),
                          h.holdCallbacks();
                  else if (window.swymCustomerId && !h.isAlreadyAuth()) {
                      h.waitForCustomerRefresh = !0;
                      a && h.productEts.makeCacheStale();
                      h.holdCallbacks();
                      var b = function () {
                          h.authn.makeCacheStale();
                          h.api.authCheck(function () {
                              h.waitForCustomerRefresh = !1;
                              a && h.productEts.makeCacheStale();
                              h.triggerSwymEvent(h.JSEvents.customerInfoRefreshed);
                              aa(!0);
                              h.api.fetch(function () {
                                  h.continueCallbacks();
                              });
                          });
                      };
                      if (h.retailerSettings.General.SyncUserMeta)
                          h.swymApiPost({
                              endpoint: "/lists/user-validate-sync",
                              params: { platform: "shopify", extuid: parseInt(window.swymCustomerId) },
                              callbackFn: function () {
                                  b();
                              },
                              errorFn: function () {
                                  b();
                              },
                              customerRefresh: !0,
                              sendRegId: !0,
                              sendSessionId: !0,
                              noProvider: !0,
                              v3: !0,
                          });
                      else {
                          var c = { action: "customer", regid: h.get(h.key.REGID), customer_id: window.swymCustomerId, swym_session_id: h.session.getSessionId() };
                          SwymUtils.ajaxOpt({
                              url: h.platform.getInterfacePath(),
                              method: "POST",
                              data: SwymUtils.getObjectAsEncoded(c),
                              callback: function (a) {
                                  b();
                              },
                          });
                      }
                  } else h.continueCallbacks();
          }
          function Rb() {
              var a = SwymUtils.getParameterByName("variant");
              triggerSwymVariantEvent(a);
          }
          function Na() {
              Ra = Ra || SwymUtils.debounce(Rb, 20);
              return Ra();
          }
          function Eb(a, b) {
              var c = {
                  "venture-775-icon": { attachSelector: ".product-single__meta-list li", customCSS: ".swym-button-bar{margin: 0px;}" },
                  "debut-1049-icon": { attachSelector: ".product-single__price span", customCSS: ".swym-button-bar{margin: 0px;}" },
                  "debut-796-icon": { attachSelector: ".product-single__price span", customCSS: ".swym-button-bar{margin: 0px;}" },
                  "debut-796-text": { attachSelector: "form.product-form", customCSS: ".swym-button-bar{margin: 10px 0px;}" },
                  "debut-796-icontext": { attachSelector: "form.product-form", customCSS: ".swym-button-bar{margin: 10px 0px;}" },
                  "debut-796-btnlink": { attachSelector: "form.product-form", customCSS: ".swym-button-bar{margin: 10px 0px;}" },
                  "debut-796-iconbtnlink": { attachSelector: "form.product-form", customCSS: ".swym-button-bar{margin: 10px 0px;}" },
                  "debut-796": {
                      customJS: function () {
                          var a = O.ui.open;
                          O.ui.open = function () {
                              try {
                                  window.theme.MobileNav.closeMobileNav();
                              } catch (b) {}
                              a.apply(O.ui, arguments);
                          };
                      },
                  },
                  "boundless-766-icon": { attachSelector: ".product__price span", customCSS: ".swym-button-bar{margin: 0px;}" },
                  "boundless [latest]-766-icon": { attachSelector: ".product__price span", customCSS: ".swym-button-bar{margin: 0px;}" },
                  "fashionopolism-141-icon": { attachSelector: ".product-prices span", customCSS: ".swym-button-bar{margin: 0px;}" },
                  "minimal-380": { customCSS: ".swym-button-bar{margin: 0px 10px;}" },
                  "classic-721-icon": { customCSS: ".swym-button-bar{margin: 0px 10px;}" },
                  "sunrise2-57-icon": { customCSS: ".swym-button-bar{margin: 0px 10px;vertical-align: top;}" },
                  "brooklyn-730-icon": { customCSS: ".swym-button-bar{margin: 0px 10px;}" },
                  "brooklyn-730-icontext": { customCSS: ".swym-button-bar{margin: 20px 10px;}" },
                  "brooklyn-730-btnlink": { customCSS: ".swym-button-bar{margin: 20px 10px;}" },
                  "brooklyn-730-iconbtnlink": { customCSS: ".swym-button-bar{margin: 20px 10px;}" },
                  "testament-623-icon": { attachSelector: "#product-price span", customCSS: ".swym-button-bar{margin: 0px;}" },
                  "testament-623": { customCSS: "#swym-plugin .swym-button,#swym-hosted-plugin .swym-button {width: auto;}" },
                  "sugar-160891530-icontext": {
                      attachSelector: "form .add-to-cart input",
                      customCSS: ".swym-button-bar{margin: 0px 10px; vertical-align: middle;} .product-wrap form .add-to-cart input{margin-right: 10px; vertical-align: middle;}",
                  },
                  "supply-679": { customCSS: "#swym-plugin #swym-notepad, #swym-hosted-plugin #swym-notepad{z-index: 1000000003;}" },
                  "icon-686": { customCSS: ".swym-button {max-width: 200px;}" },
                  "showtime-687": {
                      attachSelector: "form#addToCartForm input[id=addToCart]",
                      customCSS: ".swym-button-bar{margin: 10px 0px;}@media (max-width: 480px) {.swym-button-bar{display: block;text-align: center;margin: 4px 0px;}}",
                  },
                  "showtime-687-icon": { customCSS: ".swym-button-bar{margin: -4px 10px 0px;vertical-align: top;}" },
                  "expression-230": { attachSelector: "#product-form .buttoncont", customCSS: ".swym-button-bar{margin: 0px;} .swym-button{cursor: pointer;}" },
                  ella: {
                      attachSelector: "#product-add-to-cart",
                      customCSS:
                          ".swym-button-bar {margin: 10px;display: inline-block;height: 50px;} .swym-btn-container[data-position=default] .swym-add-to-wishlist.swym-btnlink {width: auto;font-size: initial;padding: 0px 0px 0px 4px;font-weight: initial;height: 20px;line-height: 100%;text-indent: 0px;} .swym-btn-container[data-position=default] .swym-add-to-wishlist:hover {border-color: none !important;background-color: white !important;}",
                  },
                  "kagami-live-747": {
                      customCSS:
                          ".flexbox .product__buy{-webkit-flex-wrap: wrap;-moz-flex-wrap: wrap;-ms-flex-wrap: wrap;flex-wrap: wrap; justify-content: flex-start; -webkit-justify-content: flex-start; -moz-justify-content: flex-start; -ms-justify-content: flex-start;} .flexbox .product__quantity {order: 0;} .flexbox .button--cart, .flexbox .button--cart--default, .flexbox .button--cart--not--available {order: 5; -webkit-flex-basis: 100%; -moz-flex-basis: 100%; -ms-flex-basis: 100%; flex-basis: 100%; padding: 15px 40px 16px 40px;} .swym-button-bar {margin-top: 0px;} .swym-btn-container[data-position=default] .swym-add-to-wishlist {margin-top: 15px;margin-left: -22px;margin-bottom: 15px;}",
                  },
                  "kagami-747": {
                      customCSS:
                          ".flexbox .product__buy{-webkit-flex-wrap: wrap;-moz-flex-wrap: wrap;-ms-flex-wrap: wrap;flex-wrap: wrap; justify-content: flex-start; -webkit-justify-content: flex-start; -moz-justify-content: flex-start; -ms-justify-content: flex-start;} .flexbox .product__quantity {order: 0;} .flexbox .button--cart, .flexbox .button--cart--default, .flexbox .button--cart--not--available {order: 5; -webkit-flex-basis: 100%; -moz-flex-basis: 100%; -ms-flex-basis: 100%; flex-basis: 100%; padding: 15px 40px 16px 40px;} .swym-button-bar {margin-top: 0px;} .swym-btn-container[data-position=default] .swym-add-to-wishlist {margin-top: 15px;margin-left: -22px;margin-bottom: 15px;}",
                  },
                  "blockshop-606": { attachSelector: ".prices", customCSS: ".swym-button-bar {display: block;margin-left: 0px;}" },
                  855: { attachSelector: ".ProductForm .ProductForm__AddToCart", customCSS: ".swym-button-bar {display: block; margin: 10px 0px;}.swym-button-bar .swym-btn-container * {font: inherit;line-height: inherit;}" },
                  "855-icontext": {
                      customCSS:
                          ".swym-button-bar .swym-btn-container[data-position=default]{display: block;} .swym-button-bar .swym-btn-container .swym-add-to-wishlist.swym-icontext:after{width: 20%;max-width: 50px;} .swym-button-bar .swym-btn-container .swym-add-to-wishlist.swym-icontext {width: 100%;} .swym-button-bar .swym-btn-container .swym-add-to-wishlist.swym-has-fave-count.swym-icontext {width: calc(100% - 40px);} .swym-button-bar .swym-add-to-wishlist.swym-icontext+.swym-fave-count {padding: 8px; width: 40px; text-align: center}",
                      wishlistAddClasses: "Button",
                  },
                  "855-iconbtnlink": { wishlistAddClasses: "Button" },
                  "855-btnlink": { wishlistAddClasses: "Button" },
                  "855-icon": { customCSS: ".swym-button-bar{display:flex; justify-content:center; margin:10px 0px;}" },
                  566: { attachSelector: "button.product-submit" },
                  "566-icontext": { customCSS: ".swym-button-bar { margin: 0; }" },
                  "566-icon": { customCSS: ".swym-button-bar { margin: 0; }" },
                  796: { attachSelector: "button.btn.product-form__cart-submit", customCSS: ".swym-button-bar { margin: 0; }" },
                  838: { attachSelector: "button.product-form--atc-button" },
                  857: { attachSelector: ".btn.btn--full.add-to-cart" },
                  871: { attachSelector: ".product-form__payment-container" },
                  "871-icontext": { customCSS: ".swym-button-bar { margin: 10px 0; }" },
                  "871-btnlink": { customCSS: ".swym-button-bar { margin: 10px 0; }" },
                  "871-icon": { customCSS: ".swym-button-bar { margin: 10px 0; }" },
              };
              try {
                  var d = function () {
                          SwymUtils.addClass(t, "swym-" + g);
                          SwymUtils.addClass(t, "swym-" + k);
                      },
                      e = Shopify.theme.theme_store_id,
                      g = Shopify.theme.name.toLowerCase().replace(/ /g, "") + "-" + e,
                      k = g + "-" + (b || "icon"),
                      m = e + "-" + (b || "icon"),
                      p = c[g] || c[e],
                      e = !1;
                  p || 0 !== g.indexOf("ella") || (p = c[p]);
                  if (p && (!a && p.attachSelector && ((a = p.attachSelector), (e = !0)), p.customCSS && SwymUtils.appendCustomCSS(p.customCSS), p.customJS))
                      try {
                          p.customJS.call();
                      } catch (f) {}
                  var n = c[k] || c[m];
                  if (n) {
                      if (!a || e) a = n.attachSelector;
                      n.customCSS && SwymUtils.appendCustomCSS(n.customCSS);
                      n.wishlistAddClasses && (w.AddClasses = (w.AddClasses || "") + " " + n.wishlistAddClasses);
                  }
                  var t = document.getElementById("swym-plugin");
                  t
                      ? d()
                      : h.evtLayer.addEventListener(h.JSEvents.renderUI, function () {
                            t = document.getElementById("swym-plugin");
                            d();
                        });
                  SwymUtils.addClass(document.body, "swym-" + g);
                  SwymUtils.addClass(document.body, "swym-" + k);
              } catch (f) {
                  SwymUtils.error("Error in theme selector - " + JSON.stringify(window.Shopify && window.Shopify.theme), f);
              }
              return a;
          }
          function Fb(a, b) {
              ("left" != b && "right" != b) || document.body.appendChild(a.parentNode);
          }
          function Sb() {
              var a = h.getRetailerConfig("InterfacePath");
              a && -1 < a.indexOf("swymundefined") && (a = null);
              var b = h.getApps()[0],
                  b = b && b.app;
              return a || "/apps/swym" + b + "/interfaces/interfaceStore.php?appname=" + b;
          }
          var v = [];
          (function (a, b) {
              "object" === typeof exports && exports && "string" !== typeof exports.nodeName ? b(exports) : ((a.Mustache = {}), b(a.Mustache));
              b((a.Mustache = {}));
          })(this, function (a) {
              function b(a) {
                  return "function" === typeof a;
              }
              function c(a) {
                  return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
              }
              function d(a, b) {
                  return null != a && "object" === typeof a && b in a;
              }
              function e(b, d) {
                  function e(a) {
                      "string" === typeof a && (a = a.split(u, 2));
                      if (!C(a) || 2 !== a.length) throw Error("Invalid tags: " + a);
                      K = new RegExp(c(a[0]) + "\\s*");
                      v = new RegExp("\\s*" + c(a[1]));
                      D = new RegExp("\\s*" + c("}" + a[1]));
                  }
                  if (!b) return [];
                  var f = [],
                      p = [],
                      n = [],
                      h = !1,
                      t = !1,
                      K,
                      v,
                      D;
                  e(d || a.tags);
                  for (var L = new m(b), A, G, B, F; !L.eos(); ) {
                      A = L.pos;
                      if ((B = L.scanUntil(K))) {
                          F = 0;
                          for (var O = B.length; F < O; ++F)
                              if (((G = B.charAt(F)), r.call(H, G) ? (t = !0) : n.push(p.length), p.push(["text", G, A, A + 1]), (A += 1), "\n" === G)) {
                                  if (h && !t) for (; n.length; ) delete p[n.pop()];
                                  else n = [];
                                  t = h = !1;
                              }
                      }
                      if (!L.scan(K)) break;
                      h = !0;
                      G = L.scan(z) || "name";
                      L.scan(S);
                      "=" === G ? ((B = L.scanUntil(w)), L.scan(w), L.scanUntil(v)) : "{" === G ? ((B = L.scanUntil(D)), L.scan(y), L.scanUntil(v), (G = "&")) : (B = L.scanUntil(v));
                      if (!L.scan(v)) throw Error("Unclosed tag at " + L.pos);
                      F = [G, B, A, L.pos];
                      p.push(F);
                      if ("#" === G || "^" === G) f.push(F);
                      else if ("/" === G) {
                          G = f.pop();
                          if (!G) throw Error('Unopened section "' + B + '" at ' + A);
                          if (G[1] !== B) throw Error('Unclosed section "' + G[1] + '" at ' + A);
                      } else "name" === G || "{" === G || "&" === G ? (t = !0) : "=" === G && e(B);
                  }
                  if ((G = f.pop())) throw Error('Unclosed section "' + G[1] + '" at ' + L.pos);
                  return k(g(p));
              }
              function g(a) {
                  for (var b = [], c, d, e = 0, m = a.length; e < m; ++e) if ((c = a[e])) "text" === c[0] && d && "text" === d[0] ? ((d[1] += c[1]), (d[3] = c[3])) : (b.push(c), (d = c));
                  return b;
              }
              function k(a) {
                  for (var b = [], c = b, d = [], e, m = 0, g = a.length; m < g; ++m)
                      switch (((e = a[m]), e[0])) {
                          case "#":
                          case "^":
                              c.push(e);
                              d.push(e);
                              c = e[4] = [];
                              break;
                          case "/":
                              c = d.pop();
                              c[5] = e[2];
                              c = 0 < d.length ? d[d.length - 1][4] : b;
                              break;
                          default:
                              c.push(e);
                      }
                  return b;
              }
              function m(a) {
                  this.tail = this.string = a;
                  this.pos = 0;
              }
              function p(a, b) {
                  this.view = a;
                  this.cache = { ".": this.view };
                  this.parent = b;
              }
              function f() {
                  this.cache = {};
              }
              var h = Object.prototype.toString,
                  C =
                      Array.isArray ||
                      function (a) {
                          return "[object Array]" === h.call(a);
                      },
                  r = RegExp.prototype.test,
                  H = /\S/,
                  K = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;", "`": "&#x60;", "=": "&#x3D;" },
                  S = /\s*/,
                  u = /\s+/,
                  w = /\s*=/,
                  y = /\s*\}/,
                  z = /#|\^|\/|>|\{|&|=|!/;
              m.prototype.eos = function () {
                  return "" === this.tail;
              };
              m.prototype.scan = function (a) {
                  a = this.tail.match(a);
                  if (!a || 0 !== a.index) return "";
                  a = a[0];
                  this.tail = this.tail.substring(a.length);
                  this.pos += a.length;
                  return a;
              };
              m.prototype.scanUntil = function (a) {
                  a = this.tail.search(a);
                  var b;
                  switch (a) {
                      case -1:
                          b = this.tail;
                          this.tail = "";
                          break;
                      case 0:
                          b = "";
                          break;
                      default:
                          (b = this.tail.substring(0, a)), (this.tail = this.tail.substring(a));
                  }
                  this.pos += b.length;
                  return b;
              };
              p.prototype.push = function (a) {
                  return new p(a, this);
              };
              p.prototype.lookup = function (a) {
                  var c = this.cache,
                      e;
                  if (c.hasOwnProperty(a)) e = c[a];
                  else {
                      for (var m = this, g, k, f, p = !1; m; ) {
                          if (0 < a.indexOf("."))
                              for (g = m.view, k = a.split("."), f = 0; null != g && f < k.length; )
                                  f === k.length - 1 && (p = d(g, k[f]) || (null != g && "object" !== typeof g && g.hasOwnProperty && g.hasOwnProperty(k[f]))), (g = g[k[f++]]);
                          else (g = m.view[a]), (p = d(m.view, a));
                          if (p) {
                              e = g;
                              break;
                          }
                          m = m.parent;
                      }
                      c[a] = e;
                  }
                  b(e) && (e = e.call(this.view));
                  return e;
              };
              f.prototype.clearCache = function () {
                  this.cache = {};
              };
              f.prototype.parse = function (b, c) {
                  var d = this.cache,
                      m = b + ":" + (c || a.tags).join(":"),
                      g = d[m];
                  null == g && (g = d[m] = e(b, c));
                  return g;
              };
              f.prototype.render = function (a, b, c, d) {
                  var e = this.parse(a, d);
                  b = b instanceof p ? b : new p(b);
                  return this.renderTokens(e, b, c, a, d);
              };
              f.prototype.renderTokens = function (a, b, c, d, e) {
                  for (var m = "", g, k, f, p = 0, n = a.length; p < n; ++p)
                      (f = void 0),
                          (g = a[p]),
                          (k = g[0]),
                          "#" === k
                              ? (f = this.renderSection(g, b, c, d))
                              : "^" === k
                              ? (f = this.renderInverted(g, b, c, d))
                              : ">" === k
                              ? (f = this.renderPartial(g, b, c, e))
                              : "&" === k
                              ? (f = this.unescapedValue(g, b))
                              : "name" === k
                              ? (f = this.escapedValue(g, b))
                              : "text" === k && (f = this.rawValue(g)),
                          void 0 !== f && (m += f);
                  return m;
              };
              f.prototype.renderSection = function (a, c, d, e) {
                  function m(a) {
                      return g.render(a, c, d);
                  }
                  var g = this,
                      k = "",
                      f = c.lookup(a[1]);
                  if (f) {
                      if (C(f)) for (var p = 0, n = f.length; p < n; ++p) k += this.renderTokens(a[4], c.push(f[p]), d, e);
                      else if ("object" === typeof f || "string" === typeof f || "number" === typeof f) k += this.renderTokens(a[4], c.push(f), d, e);
                      else if (b(f)) {
                          if ("string" !== typeof e) throw Error("Cannot use higher-order sections without the original template");
                          f = f.call(c.view, e.slice(a[3], a[5]), m);
                          null != f && (k += f);
                      } else k += this.renderTokens(a[4], c, d, e);
                      return k;
                  }
              };
              f.prototype.renderInverted = function (a, b, c, d) {
                  var e = b.lookup(a[1]);
                  if (!e || (C(e) && 0 === e.length)) return this.renderTokens(a[4], b, c, d);
              };
              f.prototype.renderPartial = function (a, c, d, e) {
                  if (d && ((a = b(d) ? d(a[1]) : d[a[1]]), null != a)) return this.renderTokens(this.parse(a, e), c, d, a);
              };
              f.prototype.unescapedValue = function (a, b) {
                  var c = b.lookup(a[1]);
                  if (null != c) return c;
              };
              f.prototype.escapedValue = function (b, c) {
                  var d = c.lookup(b[1]);
                  if (null != d) return a.escape(d);
              };
              f.prototype.rawValue = function (a) {
                  return a[1];
              };
              a.name = "mustache.js";
              a.version = "3.0.1";
              a.tags = ["{{", "}}"];
              var v = new f();
              a.clearCache = function () {
                  return v.clearCache();
              };
              a.parse = function (a, b) {
                  return v.parse(a, b);
              };
              a.render = function (a, b, c, d) {
                  if ("string" !== typeof a)
                      throw ((b = TypeError), (a = C(a) ? "array" : typeof a), new b('Invalid template! Template should be a "string" but "' + a + '" was given as the first argument for mustache#render(template, view, partials)'));
                  return v.render(a, b, c, d);
              };
              a.to_html = function (c, d, e, m) {
                  c = a.render(c, d, e);
                  if (b(m)) m(c);
                  else return c;
              };
              a.escape = function (a) {
                  return String(a).replace(/[&<>"'`=\/]/g, function (a) {
                      return K[a];
                  });
              };
              a.Scanner = m;
              a.Context = p;
              a.Writer = f;
              return a;
          });
          var Sa = {
                  Year: "year",
                  Month: "month",
                  Day: "day",
                  Hour: "hour",
                  Minute: "minute",
                  Years: "years",
                  Months: "months",
                  Days: "days",
                  Hours: "hours",
                  Minutes: "minutes",
                  Ago: "ago",
                  AllFilter: "All",
                  MsgVariantInStock: "This variant is currently in stock.",
                  MsgInvalidEmail: "Please enter a valid email address",
                  EmailSentMsg: "Success!",
                  SMSSentMsg: "Validation SMS sent!",
                  SMSNotReceiveMsg: "Click the sent link to verify your number. Did not receive SMS? Resend in: ",
                  ResendSMS: "Resend Text",
                  ISARemindMeBlockDesc: "Get notified via your preferred channels when this product is back in stock",
                  EmailSuccessMsg: "We will send you an email when its back in stock.",
                  AtLeastOneRequired: "Please choose at least one option",
                  ISASMSDesc: "OR Get notified via sms",
                  EmailMeCTA: "Email me",
                  EmailSwitchLabel: "Email",
                  SMSSwitchLabel: "SMS",
                  WebpushSwitchLabel: "Push",
                  SMSCTA: "Text me",
                  WebpushCTA: "Subscribe",
                  SubscribeSuccessInfo: "Successfully subscribed!",
                  SubscribeSuccessStr: "We will send you alerts on your preferred mediums",
                  ContactNoValidationNeeded: "Please validate contact number first for SMS service",
                  MsgInvalidContactNo: "Please enter valid contact number",
                  ServerError: "Unexpected server error. Please try again later.",
                  StoreQuotaExceed: "Store quota has exceeded. No more subscriptions allowed",
                  ISABISOnlyDesc: "Get notified via email when this product is back in stock",
                  ISAAllDesc: "Get automatic email alerts with updates on this product - stock level changes, price reductions, new additions and more",
                  ISAMsgDefaultError: "There was an error. Please try again.",
                  ISAMsgDefaultSuccess: "Awesome, we'll keep you informed with the latest updates.",
                  AuthMsgDefaultError: "There was an error. Please try again.",
                  AuthMsgConnectSuccess: "We've sent you an email with a verification link. Please click the link and we'll fetch your shopping history from your other connected devices.",
                  AuthMsgDisconnectError: "The attempt to reset identity for your device failed. Please try again.",
                  ShareEmailMsgSuccess: "The email was sent successfully.",
                  ShareEmailMsgNoteError: "Please enter a note!",
                  ShareEmailMsgFromError: "Invalid from name",
                  ProductNotFound: "Product Not Found.",
                  NoResultsFilter3Text: 'No items found in "Added to cart"',
                  NoResultsFilter4Text: 'No items found in "Wishlist"',
                  NoResultsFilterDefault: "No items found",
                  Subtitle: "All of your favorites, in one place",
                  AuthMsgDisconnectSuccess: "This device is no longer associated with {{userId}}",
                  ShareableWishlistURLPlaceholder: "Your shareable Wishlist URL",
                  ShareWishlistNotAuthenticatedError: 'Login or <a href="#" onclick="_swat.ui.changeTab(\'settings\')">connect</a> your wishlist to get shareable URL',
                  DefaultSharingNote: "Thought I'd share my wishlist with you - check it out!",
              },
              Ba = {
                  No: "No",
                  Yes: "Yes",
                  Loading: "Loading...",
                  ISAAddToMailingList: "Add to mailing list",
                  ISASubscribeWebpush: "Get notified on your browser",
                  ISAPrivacy: "We will send you an email once the product becomes available. Your email address will not be shared with anyone else.",
                  ISAPrivacyGeneric: "We will send you an alert once the product becomes available. Your contact information will not be shared with anyone else.",
                  SettingsUserInfo: "User Information",
                  ReviewVerifiedBuyer: "Verified Buyer",
                  DeleteDescription: "This will only remove this product from this list.",
                  DeleteConfirm: "Are you sure?",
                  ViewCartCTA: "View Cart",
                  AddedToCartCTA: "Added",
                  AddToCartCTA: "Add To Cart",
                  SoldOutCTA: "Sold out",
                  UnavailableCTA: "Unavailable",
                  ViewHistoryCTA: "View your Wishlist",
                  ISASubscribeCTA: "Subscribe",
                  SettingsConnectCTA: "Connect",
                  SettingsDisconnectCTA: "Disconnect",
                  ProductMoreDetailsCTA: "More details",
                  ProductViewFullCTA: 'View full product <i class="swym-forward-arrow-button-icon"></i>',
                  StartShoppingCTA: "Continue shopping",
                  MoreResultsCTA: 'More Results <i class="swym-forward-arrow-button-icon"></i>',
                  TurnOffCTA: "Turn off",
                  ShareEmailCTA: "Send Email",
                  ShareCTA: "Share",
                  FilterCTA: "Filter",
                  CreatedOn: "Created On:",
                  WatchlistAddCTA: "Email me when available",
                  ReceiveAlerts: "You will receive alerts on:",
                  WatchlistTooltip: "Subscribe",
                  EnterEmailPlaceholder: "Enter your email address",
                  EnterContactPlaceholder: "Enter your contact number",
                  ValidateOTPButton: "Validate OTP",
                  SATitle: "{{{uititle}}}",
                  SASubtitle: "{{{subtitle}}}",
                  SettingsUserInfoDesc: "Fetch my shopping activity from my other devices.",
                  SettingsUserRemoveDesc: "Remove this user association from my device",
                  SettingsUserGuest: "Guest",
                  SettingsConnectDescription: "Connect your {{{uititle}}} with your email to access it on all your devices",
                  TurnOffDesc: "No longer find {{{uititle}}} helpful?",
                  ShareEmailDesc: "Share your {{{wishlisttitle}}} via Email:",
                  WishlistAddCTA: "Add to {{{wishlisttitle}}}",
                  WishlistAddedCTA: "Added",
                  WishlistTooltipBefore: "Add to {{{wishlisttitle}}}",
                  WishlistTooltipAfter: "Added",
                  ShareEmailNotePlaceholder: "Hey there! Check out my {{{wishlisttitle}}}.",
                  FilterWishlistPlaceholder: "No items in your {{{wishlisttitle}}}.",
                  FilterCartPlaceholder: "No items in your Cart.",
                  UIMsgDisabled: "{{{uititle}}} is disabled for you. To enable it, simply click on <i>{{{uititle}}}</i>",
                  NoResultsTitle: "Looking for something?",
                  NoResultsText: "This is where we store your shopping activity for you - from your phone, tablet or computer. Continue shopping and check back later.",
                  ShareEmailMsgItemsError: "You need to have at least 1 item in {{{wishlisttitle}}}",
                  ShareEmailSendError: "There was an error while sharing. Please try again later.",
                  WelcomeMessage:
                      "{{{uititle}}} allows you to keep track of all of your favorites and shopping activity whether you're on your computer, phone, or tablet. You won't have to waste time searching all over again for that item you loved on your phone the other day - it's all here in one place!",
                  WelcomeTitle: "Love It? Add to {{{uititle}}}",
                  NoResultsFilter: "No items found",
                  FromNamePlaceholder: "From Name",
                  ToAddressPlaceholder: "To Address",
                  WelcomeCTA: "Access {{{uititle}}}",
                  FromNameDefault: "",
                  NoReviewsPlaceholder: "No reviews yet",
                  ShareSocialDialogTitle: "Share It",
                  ShareLoginReqdDesc: "Please login to share your wishlist",
                  ShareLoginCTA: "Login",
                  ShareConnectCTA: "Connect",
                  RemoveFromWishlistCTA: "Remove",
                  RemoveFromWishlistTooltip: "Remove",
                  HashtagCreateCTA: "Create new collection",
                  HashtagOKCTA: "OK",
                  HashtagCancelCTA: "Cancel",
                  HashtagPlaceholder: "Your new collection",
                  HashtagEditorTitle: "Add item to collection",
                  GetTriggerPermissionTitle: "Remind me about my Wishlist",
                  GetSaveWishlistTitle: "Save my Wishlist",
                  GetSaveWishlistDesc: "Sync your wishlist with your email address and easily access from any of your devices",
                  GetTriggerPermissionDesc: "We will send you an email when your Wishlist products have interesting updates to help save you time and money",
                  GetTriggerPermissionEmailPlaceholder: "Enter your email address",
                  GetSaveWishlistCTA: "SAVE WISHLIST",
                  GetTriggerPermissionCTA: "SUBSCRIBE",
                  GetTriggerPermissionDenyCTA: "No, thanks",
                  GetTriggerPermissionPrivacyInfo: "Your email address will not be shared with anyone else.",
                  WishlistAlertString: "Receive interesting updates about your wishlist products",
                  GetTriggerPermissionMailingListCheck: "Subscribe to newsletter",
                  EmailPreferencesSubscribeSuccess: "Congratulations, your subscription was successful!",
                  EmailPreferencesSubscribeError: "Something went wrong! Try again.",
                  OptInHeading: "Never miss a thing",
                  OptInDescription: "Subscribe to the store updates and never miss any alerts which can help you in your shopping journey!",
                  EmailInputPlaceHolder: "Enter Email Address",
                  SubscribeButton: "Subscribe",
                  OptInForSMS: "Opt-In For SMS Instead",
                  TermsAndPrivacy: "View our terms and privacy",
                  SubscribeSuccess: "You have successfully subscribed!",
                  OTPWarningMsg: "You will not receive OTP if you have DND. Choose email option instead.",
                  InvalidOTP: "OTP is incorrect. Please enter the correct one.",
                  DataErrorMsg: "Please provide valid details and try again.",
                  EnterOTP: "Enter 6 digits OTP",
                  ServiceUnavailable: "Service is temporarily unavailable",
                  MaxRetryReached: "Maximum retry count reached. Try again in ",
                  PhoneNoInputPlaceholder: "Enter Phone Number with Country Code",
                  SendOTPButton: "Send OTP",
                  OptInForEmail: "Opt-In For Email Instead",
                  AllowPushNotifications: "Please allow push notifications and reload the page and re-subscribe for notifications to work",
              },
              Tb = {
                  Welcome: "swym-welcome-template",
                  Device: "swym-device-template",
                  Notification: "swym-toast-template",
                  Santa: "swym-santa-template",
                  WatchlistPopup: "swym-remind-me",
                  GenToast: "swym-gen-toast-template",
                  SettingsAuth: "swym-settings-auth-template",
                  ProductTile: "swym-product-template",
                  ProductView: "swym-product-view-template",
                  Price: "swym-price-template",
                  SocialShareBlock: "swym-social-share-template",
                  WidgetContainer: "swym-widget-products-template",
                  ProductGridItem: "swym-product-grid-item-template",
                  HashtagEditor: "swym-hashtageditor-template",
                  HashtagCreate: "swym-hashtag-template",
                  PositionAttr: "swym-pos-template",
                  TriggerPermissionDialog: "swym-get-trigger-permission-template",
                  TriggeredMessagingOptinForm: "swym-get-trigger-permission-opt-in-template",
                  RemindMeBlock: "swym-remind-me-block",
              },
              y = {
                  2: "This item has been added to your Wishlist",
                  6: "There was a price drop on an item that you are watching. Check it out",
                  7: "Want to view your shopping activity later?",
                  "7.msg": "Save <b>{{SETTINGS.UI.Title}}</b> with your email and access on any device",
                  8: "Want to learn more about <b>{{SETTINGS.UI.Title}}</b>?",
                  "8.msg": "Click here for more information on how <b>{{SETTINGS.UI.Title}}</b> can help",
                  10: "Check out this new <b>{{SETTINGS.UI.Title}}</b> feature",
                  "10.msg": "We thought you'd like our wishlist module. Click here to learn more",
                  11: "An item you recently viewed is ON SALE. BUY NOW",
                  12: "Only {{stock}} more left on the item you recently viewed. BUY NOW",
                  15: "Continue shopping for an item you recently viewed",
                  16: "Do you shop across multiple devices?",
                  "16.msg": "<b>{{SETTINGS.UI.Title}}</b> is just for you! Pair your devices to access your <b>{{UI.Title}}</b> contents anywhere you shop",
                  25: "An item you were watching is back in stock. Check it out",
                  21: "Item on sale",
                  "21.msg": "Did you recently add this to your cart? It is <b>ON SALE</b>. BUY NOW",
                  23: "Item on sale",
                  "23.msg": "Did you recently add this to your wishlist? It is <b>ON SALE</b>. BUY NOW",
                  24: "Stock running low",
                  "24.msg": "An item you added to your wishlist is <b>ON SALE</b>. BUY NOW",
                  26: "An item that was on your Watch list is ON SALE. BUY NOW",
                  27: "Stock running low. Only <b>{{stock}}</b> left!",
                  "27.msg": "Did you recently add this to your cart? Last <b>{{stock}}</b> remaining. BUY NOW",
                  29: "Stock running low",
                  "29.msg": "Only <b>{{stock}}</b> more left on the item you had recently added to your shopping cart. BUY NOW",
                  31: "Someone has reviewed the item that you had recently added to cart.",
                  32: "Someone has reviewed the item that you had recently added to wishlist.",
                  33: "Someone has reviewed the item that you had recently viewed.",
                  37: "The item that you had recently added to cart is popular. {{trend-qty}} units sold.",
                  "37.msg": "Did you recently add this to your Wishlist? Last <b>{{stock}}</b> remaining. BUY NOW",
                  38: "The item that you had recently added to your wishlist is popular. {{trend-qty}} units sold.",
                  39: "The item that you had recently viewed is popular. {{trend-qty}} units sold.",
              },
              Ub = {},
              Vb = [];
          f.prototype.migrateErrorProduct = function (a) {
              var b = this.storage.getLocal(this.key.PRODUCTSMIGRATE);
              b || (SwymUtils.log("No FETCH_SCRUB job found, creating new"), (b = {}));
              a instanceof Array || (a = [a]);
              a.forEach(function (a) {
                  var d = ha(a);
                  d._mstatus = 0;
                  d._mattempts = 0;
                  b[a._id] = d;
              });
              this.storage.setLocal(this.key.PRODUCTSMIGRATE, b);
              a = window[window.SwymRetailerConfig] || {};
              a.ProductMigratorData && !this._migrating && this.migrateProducts(a);
          };
          f.prototype.migrateProducts = function (a) {
              var b = this,
                  c = this.retailerSettings.General;
              if (!T(c.ProductsVersion)) {
                  var d = b.storage.get(b.key.PRODUCTSVERSION),
                      e = c.ProductsMinTimeStamp || Date.now(),
                      g = b.storage.getLocal(b.key.PRODUCTSMIGRATE);
                  g || (SwymUtils.log("No FETCH_SCRUB job found, creating new"), (g = {}));
                  b._migrating = !0;
                  d != c.ProductsVersion
                      ? (SwymUtils.log("PRODUCTSVERSION mismatch, preparing FETCH_SCRUB, client - " + d + ", server - " + c.ProductsVersion),
                        b.productCache.makeCacheEntryStale(),
                        b.api.fetch(function (d) {
                            d.forEach(function (a, b) {
                                a.ts < e && !g[a._id] && ((g[a._id] = a), (a._mstatus = 0), (a._mattempts = 0));
                            });
                            b.storage.setLocal(b.key.PRODUCTSMIGRATE, g);
                            b.doMigrateProducts(g, a, c);
                        }))
                      : 0 < Object.keys(g).length
                      ? b.doMigrateProducts(g, a, c)
                      : delete b._migrating;
              }
          };
          f.prototype.doMigrateProducts = function (a, b, c) {
              var d = this;
              new SwymUtils.Iterator(
                  Object.keys(a),
                  function (e) {
                      SwymUtils.log("Processing FETCH_SCRUB, item - " + e.current() + ", " + e.curr);
                      var g = e.current(),
                          k = a[g];
                      1 == k._mstatus || k.et == d.EventTypes.addToCart
                          ? (SwymUtils.log("Skipping FETCH_SCRUB, item - " + e.current()), (k._mstatus = 1), e.step())
                          : (SwymUtils.log("FETCH_SCRUB calling ProductMigratorData, item - " + e.current()),
                            b.ProductMigratorData.call(d, k["raw-du"], function (b, f) {
                                f
                                    ? (k._mattempts++,
                                      k._mattempts > (c.ProductMigrateMaxAttempts || 2) && (k._mstatus = 1),
                                      d.storage.setLocal(d.key.PRODUCTSMIGRATE, a),
                                      SwymUtils.log("FETCH_SCRUB skip product, item - " + e.current()),
                                      e.step())
                                    : null == b
                                    ? (SwymUtils.log("FETCH_SCRUB product not found, item - " + e.current()),
                                      d.api.deleteEvent(function () {
                                          k._mstatus = 1;
                                          d.storage.setLocal(d.key.PRODUCTSMIGRATE, a);
                                          SwymUtils.log("FETCH_SCRUB delete product, item - " + e.current());
                                          d.ui.refreshProducts();
                                          e.step();
                                      }, g))
                                    : ((b.et = k.et),
                                      ["du", "dt"].forEach(function (a) {
                                          b[a] || (b[a] = k[a]);
                                      }),
                                      d.updateEvent(g, b, function (b) {
                                          k._mstatus = 1;
                                          d.storage.setLocal(d.key.PRODUCTSMIGRATE, a);
                                          b["raw-du"] = b.du;
                                          b.du = b["raw-du"] + "?utm_source=swym";
                                          x = new Date(b.ts);
                                          b.date = x.getUTCFullYear() + "-" + (x.getUTCMonth() + 1) + "-" + x.getUTCDate();
                                          var c = ha(k);
                                          Object.keys(b).forEach(function (a) {
                                              b[a] && (c[a] = b[a]);
                                          });
                                          delete c._mstatus;
                                          delete c._mindex;
                                          delete c._mattempts;
                                          d.updateFetchCache(c);
                                          SwymUtils.log("FETCH_SCRUB update product, item - " + e.current());
                                          d.ui.refreshProducts();
                                          e.step();
                                      }));
                            }));
                  },
                  function (a) {
                      SwymUtils.log("Starting FETCH_SCRUB, items count - " + a.length);
                  },
                  function (b) {
                      delete d._migrating;
                      SwymUtils.log("Finishing FETCH_SCRUB");
                      a = d.storage.getLocal(d.key.PRODUCTSMIGRATE);
                      b = {};
                      var g = !0,
                          k;
                      for (k in a) 0 == a[k]._mstatus && ((g = !1), (b[k] = a[k]));
                      g
                          ? (d.storage.removeLocal(d.key.PRODUCTSMIGRATE), d.storage.set(d.key.PRODUCTSVERSION, c.ProductsVersion), SwymUtils.log("PRODUCTSVERSION updated to " + c.ProductsVersion))
                          : d.storage.get(d.key.PRODUCTSVERSION) != c.ProductsVersion
                          ? (SwymUtils.log("Incomplete FETCH_SCRUB updated, saving current list"), d.storage.setLocal(d.key.PRODUCTSMIGRATE, a))
                          : (SwymUtils.log("Incomplete FETCH_SCRUB updated, saving incomplete list"), d.storage.setLocal(d.key.PRODUCTSMIGRATE, b));
                  }
              ).step();
          };
          Y.prototype.getSessionId = function () {
              var a = this.get();
              a ? ((a = a.replace(/[\\\"]/g, "")), this.setSessionId(a)) : (this.setSessionId(this.generateSwymSessionId(64)), this.sw.triggerSwymEvent(this.sw.JSEvents.sessionCreated));
              this.canStart = !0;
              return this.sessionId;
          };
          Y.prototype.setSessionId = function (a) {
              this.sessionId = a;
              this.put(this.sessionId);
              return this.sessionId;
          };
          Y.prototype.setOnStart = function (a) {
              this.canStart && (this.sw.triggerSwymEvent(this.sw.JSEvents.sessionStarted), a());
          };
          Y.prototype.generateSwymSessionId = function (a) {
              for (var b = "", c; b.length < a; ) (c = Math.random().toString(36).slice(2)), (b += c.slice(0, Math.min(c.length, a - b.length)));
              return b.toLowerCase();
          };
          Y.prototype.put = function (a) {
              return this.storage.setSessionData(this.sw.key.SESSIONID, a);
          };
          Y.prototype.get = function () {
              return this.storage.get(this.sw.key.SESSIONID);
          };
          Y.prototype.remove = function () {
              this.storage.remove(this.sw.key.O_S);
              return this.storage.remove(this.sw.key.SESSIONID);
          };
          Y.prototype.hasSessionStorage = function () {
              if ("undefined" != typeof Storage)
                  try {
                      return sessionStorage.setItem("lstest", "lstest"), sessionStorage.removeItem("lstest"), !0;
                  } catch (a) {
                      return !1;
                  }
              else return !1;
          };
          Y.prototype.migrate = function () {
              if (this.hasSessionStorage()) {
                  var a = sessionStorage.getItem("swym-" + this.sw.key.SESSIONID);
                  a && this.setSessionId(a);
                  sessionStorage.removeItem("swym-" + this.sw.key.SESSIONID);
              }
          };
          var qb = {
              General: {
                  Enabled: !0,
                  Currency: "$",
                  BaseURL: "",
                  ProductsVersion: 1,
                  RetailerName: "",
                  RetailerID: "",
                  DetectIdentity: !0,
                  ProductLevel: "product-variant",
                  QuickViewPlugin: "",
                  _v: "2",
                  DisabledMessage: "",
                  LoginPath: "/account/login",
                  MailingListCheck: !1,
              },
              Email: { EnableEmailFriend: !0, DefaultNote: "", DefaultFromAddress: "" },
              Integrations: {},
              Strings: {},
              Templates: {},
          };
          f.prototype.SwymPrefix = "swym-";
          F.prototype.performMigration = function () {
              var a = this.get("store-version");
              a != va &&
                  Vb.forEach(function (b) {
                      b.old == a && (b.migrate.call(this, O), (a = b.curr), this.set("store-version", b.curr));
                  }, this);
          };
          F.prototype.get = function (a, b) {
              var c = this.readCookie_("swym-" + a);
              return c ? ka(c) || b : b || null;
          };
          F.prototype.getRaw = function (a, b) {
              return this.readCookie_(a) || b;
          };
          F.prototype.getLocal = function (a, b) {
              if (!this.canStoreLocally) return null;
              var c = window.localStorage.getItem("swym-" + a);
              return c ? ka(c) : null;
          };
          F.prototype.set = function (a, b) {
              this.createCookie_("swym-" + a, JSON.stringify(b), this.primaryDomain);
          };
          F.prototype.setSessionData = function (a, b) {
              this.createSessionCookie_("swym-" + a, JSON.stringify(b), this.primaryDomain);
          };
          F.prototype.setRaw = function (a, b) {
              this.createCookie_(a, JSON.stringify(b), this.primaryDomain);
          };
          F.prototype.setLocal = function (a, b) {
              this.canStoreLocally && window.localStorage.setItem("swym-" + a, JSON.stringify(b));
          };
          F.prototype.removeLocal = function (a) {
              this.canStoreLocally && window.localStorage.removeItem("swym-" + a);
          };
          F.prototype.remove = function (a) {
              this.eraseCookie_("swym-" + a);
          };
          F.prototype.removeNoPrefix = function (a) {
              this.eraseCookie_(a);
          };
          F.prototype.createCookie_ = function (a, b, c) {
              var d = new Date();
              d.setTime(d.getTime() + 31536e6);
              d = "; expires=" + d.toGMTString();
              document.cookie = a + "=" + b + d + "; path=/" + (c ? ";domain=." + c : "");
          };
          F.prototype.createSessionCookie_ = function (a, b, c) {
              var d = new Date();
              d.setTime(d.getTime() + 18e5);
              d = "; expires=" + d.toGMTString();
              document.cookie = a + "=" + b + d + "; path=/" + (c ? ";domain=." + c : "");
          };
          F.prototype.readCookie_ = function (a) {
              a += "=";
              for (var b = document.cookie.split(";"), c = 0; c < b.length; c++) {
                  for (var d = b[c]; " " == d.charAt(0); ) d = d.substring(1, d.length);
                  if (0 == d.indexOf(a)) return d.substring(a.length, d.length);
              }
              return null;
          };
          F.prototype.eraseCookie_ = function (a) {
              document.cookie = a + "=;path=/" + (this.primaryDomain ? ";domain=" + this.primaryDomain : "") + ";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          };
          f.prototype.hasLocalStorage = Xa;
          f.prototype.getPrimaryDomain = Wa;
          R.prototype.putObject = function (a) {
              a && (this.storage.setLocal(this.cacheName, a), this.storage.setLocal(this.cacheTimestampName, this.getCurrentTimeInSeconds()));
          };
          R.prototype.updateObject = function (a) {
              a && this.storage.setLocal(this.cacheName, a);
          };
          R.prototype.getObject = function () {
              return this.storage.getLocal(this.cacheName);
          };
          R.prototype.getCurrentTimeInSeconds = function () {
              return new Date().getTime() / 1e3;
          };
          R.prototype.isCacheEntryStale = function () {
              return (this.storage.getLocal(this.cacheTimestampName) || 0) + this.cacheTTL <= this.getCurrentTimeInSeconds();
          };
          R.prototype.makeCacheEntryStale = function () {
              this.storage.getLocal(this.cacheTimestampName);
              this.storage.setLocal(this.cacheTimestampName, 0);
          };
          R.prototype.updateCacheTsBy = function (a) {
              var b = this.storage.getLocal(this.cacheTimestampName) || 0;
              this.storage.setLocal(this.cacheTimestampName, b + Math.min(a, 0.1 * this.cacheTTL));
          };
          v.push({
              id: "cache",
              init: function () {
                  this.exports("Cache", R);
              },
          });
          A.prototype.makeCacheStale = function () {
              this.mcache = null;
              this.cached && this.lcache.makeCacheEntryStale();
          };
          A.prototype.isCacheStale = function () {
              return this.cached && this.lcache.isCacheEntryStale();
          };
          A.prototype.markHashStale = function (a) {
              a = this.hashFn(a);
              this.mcache && (delete this.mcache[a], this.cached && this.lcache.putObject(this.mcache));
          };
          A.prototype.triggerEvent = function (a, b) {
              var c = new SwCustomEvent(a, { detail: { d: b } });
              this.evtLayer.dispatchEvent(c);
              return c;
          };
          A.prototype.fetch = function (a) {
              a.params = SwymUtils.extendDefaults(a.params, this.defaultParams);
              var b = a.hash || this.hashFn(a.params);
              a.hash = b;
              var c = this.cached && this.lcache.isCacheEntryStale(),
                  d;
              c
                  ? (this.mcache = {})
                  : (this.mcache || ((this.mcache = this.cached ? this.lcache.getObject() || {} : {}), this.triggerEvent("cacheloaded", this.mcache)), (d = this.mcache[b]), SwymUtils.isUndefined(d) && a.allowCacheMiss && (d = null));
              var e = this;
              SwymUtils.isUndefined(d)
                  ? this.inProgress[b]
                      ? this.callbacks[b].push(a)
                      : ((this.inProgress[b] = !0),
                        (this.callbacks[b] = [a]),
                        a.lcb && a.lcb(a),
                        c && this.preloadCache
                            ? this.preloadInProgress ||
                              ((this.preloadInProgress = !0),
                              this.preloadCacheFn(
                                  function (b) {
                                      e.preloadInProgress = !1;
                                      e.cacheLoadScb(a, b);
                                  },
                                  function (b, c) {
                                      e.preloadInProgress = !1;
                                      e.cacheLoadFcb(a, b, c);
                                  }
                              ))
                            : this.internalFn(
                                  a,
                                  function (b) {
                                      e.internalScb(a, b);
                                  },
                                  function (b, c) {
                                      e.internalFcb(a, b, c);
                                  }
                              ))
                  : ((this.callbacks[b] = this.callbacks[b] || []),
                    this.callbacks[b].push(a),
                    setTimeout(function () {
                        e.handleCallbacks(a, d);
                    }));
          };
          A.prototype.internalScb = function (a, b) {
              var c = this.transformFn(b, a),
                  d = a.hash,
                  e = { opts: a, ret: c, oret: b };
              this.mcache || ((this.mcache = this.cached && this.lcache.isCacheEntryStale() ? this.lcache.getObject() || {} : {}), this.triggerEvent("cacheloaded", this.mcache));
              this.mcache[d] = c;
              this.cached && this.lcache.putObject(this.mcache);
              var g = this;
              setTimeout(function () {
                  g.gSEvtNames.forEach(function (a) {
                      this.swat.triggerSwymEvent(a + ":" + d, e);
                      this.swat.triggerSwymEvent(a, c);
                  }, g);
                  g.lSEvtNames.forEach(function (a) {
                      this.triggerEvent(a + ":" + d, e);
                      this.triggerEvent(a, e);
                  }, g);
              });
              this.handleCallbacks(a, c);
          };
          A.prototype.internalFcb = function (a, b, c) {
              var d = this,
                  e = a.hash,
                  g = { opts: a, err: b, xhr: c };
              setTimeout(function () {
                  d.gFEvtNames.forEach(function (a) {
                      this.swat.triggerSwymEvent(a + ":" + e, g);
                      this.swat.triggerSwymEvent(a, g);
                  }, d);
                  d.lFEvtNames.forEach(function (a) {
                      this.triggerEvent(a + ":" + e, g);
                      this.triggerEvent(a, g);
                  }, d);
              });
              this.handleCallbacks(a, null, b, c);
          };
          A.prototype.handleCallbacks = function (a, b, c, d) {
              var e = a.hash,
                  g = this.callbacks[e] || [];
              this.internalExecCb(
                  g,
                  c
                      ? function (b) {
                            b.fcb && b.fcb.apply(this, [c, d, a]);
                        }
                      : function (c) {
                            c.scb && c.scb.apply(this, [b, a]);
                        }
              );
              this.internalExecCb(g, function (e) {
                  e.ecb && e.ecb.apply(this, [a, b, c, d]);
              });
              delete this.inProgress[e];
              0 == g.length && delete this.callbacks[e];
          };
          A.prototype.internalExecCb = function (a, b) {
              try {
                  for (; 0 < a.length; ) {
                      var c = a.shift();
                      b.call(this, c);
                  }
              } catch (d) {
                  SwymUtils.error("InternalExecCb error", d);
              }
          };
          A.prototype.setPreloadParams = function (a) {
              this.preloadParams = a;
          };
          A.prototype.cacheLoadScb = function (a, b) {
              if (Array.isArray(b))
                  b.forEach(function (a, b) {
                      var c = this.preloadHashFn(a, b);
                      this.internalScb({ params: {}, hash: c, fromPreload: !0 }, this.preLoadTransformFn ? this.preLoadTransformFn(a) : a);
                  }, this);
              else if (0 < Object.keys(b).length)
                  for (var c in b) {
                      var d = b[c],
                          e = this.preloadHashFn(d, c);
                      this.internalScb({ params: {}, hash: e, fromPreload: !0 }, this.preLoadTransformFn ? this.preLoadTransformFn(d) : d);
                  }
              else a.allowCacheMiss && this.internalScb({ params: {}, hash: a.hash, fromPreload: !0 }, null);
          };
          A.prototype.cacheLoadFcb = function (a, b, c) {
              this.internalFcb(a, b, c);
          };
          A.prototype.addCallback = function (a) {
              var b = this.hashFn(a);
              this.inProgress[b] = !0;
              this.callbacks[b] = this.callbacks[b] || [];
              this.callbacks[b].push(a);
          };
          A.prototype.isInProgress = function (a) {
              a = this.hashFn(a);
              return this.inProgress[a];
          };
          v.push({
              id: "fmodel",
              init: function () {
                  A.swat = A.prototype.swat = this;
                  A.defaultOpts = A.prototype.defaultOpts = {
                      cached: !0,
                      expiry: 300,
                      cacheStaleEvts: [f.JSEvents.regidRefreshed, f.JSEvents.regidCleaned],
                      lSEvtNames: ["change"],
                      gSEvtNames: [],
                      lFEvtNames: ["failure"],
                      gFEvtNames: [],
                      hashFn: function (a) {
                          return SwymUtils.getHashCode(JSON.stringify(a));
                      },
                      transformFn: function (a, b) {
                          return a;
                      },
                      preloadCache: !1,
                      preloadCacheFn: null,
                      preloadHashFn: null,
                      preLoadTransformFn: null,
                      defaultParams: {},
                  };
                  this.FetchModel = A;
              },
          });
          var va = "3.0.0.16",
              Ta = "sa_r";
          f.prototype.__SA_READY = function () {
              this.get(Ta) || (this.set(Ta, !0), this.clearSettingsCache(), new R("products", null, this.storage).putObject({}));
          };
          var Wb = { init: function () {}, instruments: {}, events: {}, cfg: {} };
          f.prototype.loadModule = function (a) {
              try {
                  a = SwymUtils.extendDefaults(a, Wb);
                  SwymUtils.log("Module loading - " + a.id);
                  for (var b in a.instruments) f.Instrumentation[b] = a.instruments[b];
                  for (b in a.events) f.JSEvents[b] = a.events[b];
                  for (b in a.cfg) qb[b] = a.cfg[b];
                  a.init.apply(this, [this]);
                  SwymUtils.log("Module loaded - " + a.id);
              } catch (c) {
                  SwymUtils.error("Error loading swymModule - " + a.id, c);
              }
          };
          f.prototype.exports = function (a, b) {
              this[a] = b;
          };
          f.prototype.setSwymEmail = function (a) {
              this.set(this.key.EMAIL, a);
          };
          f.prototype.getSwymEmail = function () {
              return this.get(this.key.EMAIL);
          };
          f.prototype.setSwymUserPref = function (a) {
              this.set(this.key.UPREF, a);
          };
          f.prototype.getSwymUserPref = function () {
              return this.get(this.key.UPREF);
          };
          f.prototype.setSwymAuthn = function (a) {
              this.set(this.key.AUTHN, a);
          };
          f.prototype.isSwymAuthn = function () {
              return null != this.getSwymEmail();
          };
          f.prototype.get = function (a) {
              return a == this.key.PID ? this.pid : this.storage.get(a);
          };
          f.prototype.set = function (a, b) {
              this.key.PID == a && (this.pid = b);
              this.storage.set(a, b);
          };
          f.prototype.removeUserFromDeviceBadAuth = function (a, b) {
              var c = this;
              this.removeUserFromDeviceInternal(function () {
                  c.set(c.key.MISAUTHCHK, !0);
                  a && a();
              }, b);
          };
          f.prototype.refresh = function (a, b) {
              var c = this;
              this.get(this.key.REGID)
                  ? this.api.authCheck(a, b)
                  : ((this.isRegistering = !0),
                    this.swymApi({
                        endpoint: "/register",
                        callbackFn: function (b, e) {
                            c.isRegistering = !1;
                            var g = e.getResponseHeader("x-swym-regid");
                            g && (c.set(c.key.REGID, g), b.sessionId && (c.set(c.key.REMOTEAUTH, b.remoteAuth), c.session.setSessionId(b.sessionId)), c.triggerSwymEvent(f.JSEvents.registered, g), a && a(g));
                        },
                        errorFn: b,
                        sendRegId: !1,
                        sendSessionId: !1,
                        checkRegId: !1,
                    }));
          };
          f.prototype.countInternal = function (a, b, c, d, e, g) {
              this.swymApi({ endpoint: "/eventcount", params: { du: d, et: a, epi: g, type: e }, callbackFn: b, errorFn: c, checkRegId: !1, v2: !0 });
          };
          f.prototype.sendInternal = function (a, b, c) {
              a.et == this.EventTypes.addToWishList && this.storage.setSessionData(this.key.SVD, 1);
              if (a.cprops && "object" !== typeof a.cprops) throw Error("cprops should be an object");
              this.triggerSwymEvent(f.JSEvents.beforeCollect, a);
              var d = this,
                  e = !1,
                  g = ga(a);
              if (g.epi && g.empi && !g.pr && !g.iu && ((e = !0), this.findProduct)) {
                  var k = this.findProduct(g.epi, !0);
                  k && (g = Object.assign(g, k));
              }
              var m = this.get(this.key.REGID);
              try {
                  null !== a.variants && "object" === typeof a.variants && (a.variants = JSON.stringify(a.variants));
              } catch (n) {
                  SwymUtils.error("Error in stringifying variants key - " + n);
              }
              if (this.storage.getRaw("swym-ext-registering"))
                  SwymUtils.log("Waiting for external register"),
                      (this.isRegistering = !0),
                      this.evtLayer.addEventListener(this.JSEvents.externalRegisterDone, function (e) {
                          SwymUtils.log("External register done");
                          d.isRegistering = !1;
                          d.set(d.key.REGID, e.detail.d);
                          d.sendInternal(a, b, c);
                          d.triggerSwymEvent(f.JSEvents.registered, e.detail.d);
                      });
              else {
                  m || (this.isRegistering = !0);
                  k = g.currEt;
                  delete g.currEt;
                  var k = g.et == this.EventTypes.addToWishList || k == this.EventTypes.addToWishList,
                      p = this.isSimpleWishlistOnly() || this.isNonFetchUI();
                  this.swymApiPost({
                      endpoint: k ? (e ? "/epiRecordWishlist" : "/recordWishlistAction") : p ? "/collect" : "/collectAll",
                      params: { event: g },
                      callbackFn: function (a, c) {
                          d.isRegistering = !1;
                          var e = a.regid;
                          e && (d.set(d.key.REGID, e), m != e && d.triggerSwymEvent(m ? f.JSEvents.regidRefreshed : f.JSEvents.registered, e));
                          b && b(a, c);
                      },
                      errorFn: c,
                      checkRegId: !1,
                      v2: !0,
                  });
              }
          };
          f.prototype.reduceFavecount = function (a, b, c) {
              a = ga(a);
              this.swymApiPost({
                  endpoint: "/eventcount/reduce",
                  params: { event: a },
                  callbackFn: function (a, c) {
                      b && b(a, c);
                  },
                  errorFn: c,
                  checkRegId: !1,
                  v2: !0,
                  sendSessionId: !1,
                  sendRegId: !1,
              });
          };
          f.prototype.allGetInternal = function (a, b) {
              var c = this;
              if (this.retailerSettings) {
                  var d = {};
                  if (!this.getSwymRegistrationId()) this.productEts.addCallback(d), this.productEts.cacheLoadScb(d, [[]]);
                  else if (!(this.authn.isInProgress(d) && this.currDevice.isInProgress(d) && this.productEts.isInProgress(d))) {
                      this.authn.addCallback(d);
                      this.retailerSettings.General.UseFetchWithML || this.productEts.addCallback(d);
                      this.currDevice.addCallback(d);
                      var e = this.isSimpleWishlistOnly(),
                          g = this.isNonFetchUI(),
                          k = h.getApp("ShoppingAssistant"),
                          m = this.get(this.key.SVD),
                          f = null === m || 1 == m || this.isAlreadyAuth(),
                          m = "/get",
                          e = { days: 30, f: g ? "noFetch" : e ? "fetchWishlist" : f ? "fetchIncludeSaved" : "fetch" };
                      this.retailerSettings.General.UseProductMetadataStore && ((m = "/getWithMetadata"), (e["cached-products"] = this.getCachedProducts()));
                      this.retailerSettings.General.UseFetchWithML && (e["bkt-check"] = !0);
                      k && k.enabled && (e.f = "fetchSavedWithBackfill");
                      this.retailerSettings.General.UseFetchWithML && (this.isDefaultBucket() || (e.f += "ML"));
                      this.swymApiPost({
                          endpoint: m,
                          params: e,
                          callbackFn: function (b, e) {
                              c.currDevice.cacheLoadScb(d, [b.devices]);
                              c.authn.cacheLoadScb(d, [b.authn]);
                              if (c.retailerSettings.General.UseFetchWithML) c.productEts.fetch({ params: {} });
                              else {
                                  var m = b.fetch;
                                  if (c.retailerSettings.General.UseProductMetadataStore) {
                                      c.upsertProductsToCache(m.metadata);
                                      var g = c.getApp("ShoppingAssistant");
                                      0 < m.epis.length && g && c.resetBackfillProductsCache ? c.resetBackfillProductsCache() : m.backfill && c.upsertBackfillProductsToCache && c.upsertBackfillProductsToCache(m.backfill || []);
                                  }
                                  c.retailerSettings.General.UseProductMetadataStore && ((c.productEts.reassignPreloadHashFn = !0), c.productEts.reassignFnForMetadataStore());
                                  c.productEts.cacheLoadScb(d, [m]);
                              }
                              a && a(b, e);
                          },
                          errorFn: b,
                          v2: !0,
                          waitForRegister: !0,
                      });
                  }
              } else
                  this.evtLayer.addEventListener(this.JSEvents.readRetailerConfig, function () {
                      c.allGetInternal();
                  });
          };
          f.prototype.sendEmailWishListInternal = function (a, b, c, d, e, g) {
              if (!SwymUtils.validateEmail(a)) throw Error("Invalid email address");
              this.isCollectionsEnabled() && this.retailerSettings.Wishlist.AllowSharing
                  ? ((a = { toemail: a.toLowerCase(), fromemail: b, note: c }),
                    d && (a.hashtag = d),
                    this.swymApiPost({ endpoint: d ? "/emailWishListCollection" : "/emailSimpleWishList", params: a, callbackFn: e, errorFn: g, checkRegId: !0, sendSessionId: !0, v2: !0 }))
                  : this.swymApiPost({ endpoint: "/user/emailWishList", params: { toemail: a.toLowerCase(), fromemail: b, note: c, days: 90 }, callbackFn: e, errorFn: g });
          };
          f.prototype.createPin = function (a, b, c) {
              this.swymApiPost({ endpoint: "/pin/create", params: { pin: a }, callbackFn: b, errorFn: c });
          };
          f.prototype.verifyPin = function (a, b, c) {
              this.swymApiPost({
                  endpoint: "/pin/verify",
                  params: { pin: a },
                  callbackFn: function (a, c) {
                      b && b(pairSuccess);
                  },
                  errorFn: c,
              });
          };
          f.prototype.validateUser = function (a, b, c) {
              if (1 != this.isSwymAuthn()) {
                  var d = this;
                  this.swymApiPost({
                      endpoint: "/provider/validate",
                      params: { e: a },
                      callbackFn: function (a, c) {
                          d.refreshViaProvider();
                          b && b();
                      },
                      errorFn: c,
                  });
              }
          };
          f.prototype.readRetailerConfig = function (a, b) {
              this.readRetailerConfigInternal(a, b);
          };
          f.prototype.readRetailerConfigInternal = function (a, b, c) {
              var d = this,
                  e = this.storage.getLocal(this.key.RSETCACHE) || {},
                  g = this.storage.getLocal(this.key.RAPPSCACHE) || this.appsCache || [];
              this.appsCache = g;
              c || !d.versionChecking
                  ? setTimeout(function () {
                        a && a(e, g);
                    }, 10)
                  : (this.evtLayer.addEventListener(this.JSEvents.readApps, function (a) {
                        a = a.detail.d;
                        d.appsCache = a;
                        d.storage.setLocal(d.key.RAPPSCACHE, a);
                    }),
                    this.evtLayer.addEventListener(this.JSEvents.readSettings, function (c) {
                        c = c.detail.d;
                        for (var m in c) e[m] = c[m];
                        m = d.storage.getLocal(d.key.RAPPSCACHE) || d.appsCache;
                        d.storage.setLocal(d.key.RSETCACHE, e);
                        e.ignoreCache && d.clearSettingsCache(!0);
                        e.v ? a && a(e, m) : (SwymUtils.log("Error loading retailer config", !0), b && b(e, c));
                    }));
          };
          f.prototype.remoteAuthRequestInternal = function (a, b, c) {
              if (!SwymUtils.validateEmail(a)) throw Error("Invalid email address");
              var d = this,
                  e = this.get(this.key.REMOTEAUTH);
              (e && 1 !== e) ||
                  this.swymApi({
                      endpoint: "/remote/request",
                      params: { email: a.toLowerCase() },
                      callbackFn: function (a) {
                          d.set(d.key.REMOTEAUTH, 1);
                          b && b(a);
                      },
                      errorFn: c,
                  });
          };
          f.prototype.removeUserFromDeviceInternal = function (a, b) {
              if (1 == this.isSwymAuthn()) {
                  var c = this;
                  this.swymApiDelete({
                      endpoint: "/user/remove",
                      callbackFn: function (b, e) {
                          var g = e.getResponseHeader("x-swym-regid");
                          g && (c.set(c.key.REGID, g), c.setSwymEmail(null), SwymUtils.log("Registration id refreshing.." + g), c.get(c.key.REMOTEAUTH) && c.storage.remove(c.key.REMOTEAUTH));
                          c.triggerSwymEvent(f.JSEvents.regidRefreshed, { regid: g, disconnect: !0 });
                          a && a(g);
                      },
                      errorFn: function (a) {
                          SwymUtils.log("Unable to remove this device");
                          b && b(a);
                      },
                  });
              }
          };
          f.prototype.send = function (a, b, c) {
              var d = window._swat;
              if ("loading" != document.readyState)
                  d.sendInternal(a, b, c),
                      (f.prototype.send = function (a, b, c) {
                          d.sendInternal(a, b, c);
                      });
              else
                  SwymUtils.onDOMReady(function () {
                      d.sendInternal(a, b, c);
                      f.prototype.send = function (a, b, c) {
                          d.sendInternal(a, b, c);
                      };
                  });
          };
          f.prototype.versionCheck = function (a, b) {
              var c = this.storage.get(this.key.O_S),
                  d = this.storage.getLocal(this.key.RSETCACHE);
              if (c && d) Za(d, this);
              else {
                  this.versionChecking = !0;
                  var d = d || {},
                      e = this;
                  2 == this.storage.get(this.key.VERSIONCHECKED)
                      ? (SwymUtils.warn("Skipping version check"), (this.versionChecking = !1), a && a(!1), e.allGetInternal())
                      : (e.allGetInternal(),
                        this.swymApi({
                            endpoint: this._vcheckURL,
                            params: { js_v: va, s_v: d.v || "0-0", s_format: "json", f: 1 == this.forceCheckFlag },
                            callbackFn: function (b) {
                                e.versionChecking = !1;
                                var c = b.versioncheck,
                                    d = b.settings,
                                    f = b[e._vcheckFiltersKey],
                                    n = b.apps,
                                    h = b.currency;
                                if (h && d) {
                                    var C = d.settings;
                                    C.General.Currency = h;
                                    d.settings = C;
                                }
                                d &&
                                    ((d.settings.Strings = d.settings.Strings || {}),
                                    e.triggerSwymEvent(e.JSEvents.preReadSettings, d),
                                    d.settings.General.IgnoreCacheTS && new Date() < new Date(d.settings.General.IgnoreCacheTS) && (d.ignoreCache = !0),
                                    (d.settings = JSON.stringify(d.settings)),
                                    Za(d, e));
                                if (c)
                                    if (e.storage.get(e.key.VERSIONCHECKED))
                                        e.storage.setSessionData(e.key.VERSIONCHECKED, 2),
                                            SwymUtils.error("Unable to fetch latest swym version", Error("Unable to fetch latest swym version. Aborting load till session expires"), "Current Version - " + va);
                                    else {
                                        e.storage.setSessionData(e.key.VERSIONCHECKED, 1);
                                        e.clearSettingsCache();
                                        getSwymConfig();
                                        c = document.querySelectorAll("script[src*=swym]");
                                        h = [];
                                        for (C = 0; C < c.length; C++) h.push(c[C].src);
                                        h.forEach(function (a) {
                                            SwymUtils.ajaxOpt({ method: "GET", url: a, headers: { "Cache-Control": "max-age=0" } });
                                        });
                                    }
                                else e.storage.setSessionData(e.key.O_S, !0), e.storage.remove(e.key.VERSIONCHECKED);
                                e.triggerSwymEvent(e.JSEvents.preReadFilters, f);
                                e.triggerSwymEvent(e.JSEvents.preReadApps, n);
                                e.triggerSwymEvent(e.JSEvents.readFilters, f);
                                e.triggerSwymEvent(e.JSEvents.readApps, n);
                                e.triggerSwymEvent(e.JSEvents.readSettings, d || {});
                                a && a(b);
                            },
                            v2: !0,
                            errorFn: b,
                            sendRegId: !1,
                            sendSessionId: !1,
                            checkRegId: !1,
                        }));
              }
          };
          f.prototype.setRetailerSettings = function (a) {
              this.retailerSettings = a;
          };
          f.prototype.shouldShowEmail = function () {
              return this.retailerSettings ? (this.retailerSettings.Email ? this.retailerSettings.Email.EnableEmailFriend : !0) : !0;
          };
          f.prototype.setCurrency = function (a) {
              this.currency = a || this.currency;
          };
          f.prototype.setCurrentPageData = function (a) {
              this.currentPageData = a || this.currentPageData;
          };
          f.prototype.getCurrentPageData = function () {
              return this.currentPageData;
          };
          f.prototype.turnOff = function () {
              SwymUtils.addClass(document.body, "swym-turned-off");
              SwymUtils.warn("Turning off");
              for (var a in f.prototype) f.prototype[a] = function () {};
          };
          f.prototype.turnOffApis = function () {
              SwymUtils.warn("Turning off Apis");
              "fetch fetchWrtEventType send versionCheck authCheck devices setFilters enableUINotifications".split(" ").forEach(function (a) {
                  f.prototype[a] = function () {};
              });
              ["doYourThing", "processEventMap"].forEach(function (a) {
                  SwymRetailer.prototype[a] = function () {};
              });
              f.prototype.readRetailerConfig = function (a, b) {
                  this.readRetailerConfigInternal(a, b, !0);
              };
          };
          f.prototype.turnOffTracking = function () {
              SwymUtils.warn("Turning off tracking");
              ["send", "enableUINotifications"].forEach(function (a) {
                  f.prototype[a] = function () {};
              });
          };
          f.PINStatus = f.prototype.PINStatus = { NO_AUTH: 0, PIN_AVAILABLE: 1, EMAIL_ONLY: 2, PIN_CREATED: 3 };
          f.prototype.initProductDetailsAPI = function () {
              this.platform.productDetails = new this.FetchModel({
                  name: "productDetails",
                  cached: !1,
                  hashFn: this.platform.productDetailsCfg.hashFn,
                  internalFn: this.platform.productDetailsCfg.internalFn,
                  preloadHashFn: this.platform.productDetailsCfg.preloadHashFn,
              });
          };
          f.prototype.getProductDetails = function (a, b, c) {
              this.platform
                  ? (this.platform.productDetails.fetch({ params: a, scb: b, fcb: c }), (a = Object.keys(this.platform.productDetails.mcache)), 30 < a.length && delete this.platform.productDetails.mcache[a.pop()])
                  : c("Swym ecomm-platform not defined");
          };
          f.prototype.openCartPage = function () {
              this.retailerSettings.General.DisableAutoOpenCart || this.openDirectCartPage();
          };
          f.prototype.openDirectCartPage = function () {
              this.platform.redirectToCartPage();
          };
          f.prototype.replayAddToCart = function (a, b, c, d) {
              this.platform.addToCart({ epi: b, product: a, callback: c, errorCallback: d });
          };
          f.prototype.clearSettingsCache = function (a) {
              this.storage.remove(this.key.O_S);
              this.storage.removeLocal(this.key.RAPPSCACHE);
              this.storage.removeLocal(this.key.RSETCACHE);
              a || (this.forceCheckFlag = !0);
          };
          f.prototype.getApp = function (a, b) {
              var c = null;
              (b || this.appsCache).forEach(function (b) {
                  "string" == typeof b ? b == a && (c = { app: a, "is-paid": !0, enabled: !0 }) : b.app == a && (c = b);
              });
              return c;
          };
          f.prototype.getApps = function () {
              return this.appsCache;
          };
          f.prototype.hidePoweredBy = function () {
              return this.appsCache.some(function (a) {
                  return a["is-paid"];
              });
          };
          f.prototype.ThemeStringKeys = { addToCart: "addToCart", soldOut: "soldOut" };
          f.prototype.getThemeString = function (a) {
              return "";
          };
          f.prototype.getEmpisFromProducts = function (a) {
              var b = [];
              a.forEach(function (a) {
                  (a = a.empi) && -1 == b.indexOf(a) && b.push(a);
              });
              return b;
          };
          f.prototype.customizeStyleFromSettings = function (a, b) {
              var c = "<style>",
                  d = "custom" == a.LauncherIcon ? a.CustomIcon : a.Icon;
              d && (c += "#swym-plugin #swym-anchor .swym-icon { background: url('" + d + "') !important; background-size: 20px !important;}");
              a.WelcomeSplash && (c += "#swym-plugin #swym-sa .swym-welcome-container:before, #swym-plugin #swym-sa .swym-welcome-container:after {background-image: url('" + a.WelcomeSplash + "')}");
              c = { htmlText: c };
              this.triggerSwymEvent(this.JSEvents.customizeStyleFromSettings, c);
              c = c.htmlText;
              SwymUtils.onHostedUI() && (a.UseCustomLauncher = !0);
              this.hidePoweredBy() && (c += ".swym-powered-by{display: none;}");
              a.CustomCSS && (c += "</style><style id='swym-ui-customcss'>" + a.CustomCSS + "</style><style>");
              "custom" == a.LauncherLocation
                  ? (a.UseCustomLauncher = !0)
                  : this.evtLayer.addEventListener(this.JSEvents.renderUI, function () {
                        document.getElementById("swym-anchor").setAttribute("data-position", a.LauncherLocation || "right");
                    });
              if (a.UseCustomLauncher) {
                  var c = c + "#swym-anchor { display: none !important; }",
                      e = this;
                  if (a.CustomAnchorSelector) {
                      SwymUtils.addDOMEventListener(a.CustomAnchorSelector, "click", function (a) {
                          a.preventDefault();
                          a.stopImmediatePropagation();
                          e.ui.open();
                      });
                      for (var d = document.querySelectorAll(a.CustomAnchorSelector), g = 0; g < d.length; g++) {
                          var k = d[g];
                          k.onclick = null;
                          SwymUtils.addClass(k, "swym-loaded");
                      }
                  } else "custom" != a.LauncherLocation && SwymUtils.warn("ui.CustomAnchorSelector not found in config");
              }
              a.NotificationOnly ? (c += "#swym-anchor { display: none !important; }.swym-view-history { display: none !important; }") : a.Enabled || (c += "#swym-anchor { display: none !important; }");
              return (c += "</style>");
          };
          f.prototype.initializeUi = function (a) {
              var b = this,
                  c = b.retailerSettings.UI,
                  d = b.retailerSettings.Wishlist;
              watchlist = b.retailerSettings.Watchlist;
              sa = b.retailerSettings.SA;
              if (SwymUtils.isElementAvailable("#swym-plugin")) SwymUtils.warn("Tried to load UI Twice"), a && a(!1);
              else if (SwymUtils.matchURLInArray(c.DisallowedURLPatterns || [])) {
                  var e = document.querySelector("#swym-plugin");
                  e && SwymUtils.addClass(e, "swym-disallowed");
                  c.Enabled = !1;
                  d.Enabled = !1;
                  watchlist.Enabled = !1;
                  a(!1);
              } else
                  b.enableUINotifications(),
                      SwymUtils.getStylesTemplate(function (e) {
                          if (e) {
                              var k = document.createElement("div");
                              k.id = "swym-styles";
                              e += b.customizeStyleFromSettings(c, b.retailerSettings);
                              k.innerHTML = e;
                              document.body.appendChild(k);
                          }
                          SwymUtils.getBodyTemplate(function (e) {
                              var g = b.retailerSettings.Strings || {},
                                  k = document.createElement("div");
                              k.setAttribute("id", "swym-container");
                              var f = { uititle: c.Title, subtitle: c.Subtitle || g.Subtitle || Sa.Subtitle, satitle: sa && sa.Title, wishlisttitle: d.Title || c.Title || (sa && sa.Title) },
                                  h;
                              for (h in Ba) {
                                  var r = g[h];
                                  r || (g[h] = r = SwymUtils.originalRenderFn(Ba[h], f));
                                  e = e.replace(new RegExp("__" + h + "__", "g"), r);
                              }
                              b.retailerSettings.Strings = SwymUtils.extendDefaults(g, Sa);
                              b.retailerSettings.Templates = SwymUtils.extendDefaults(b.retailerSettings.Templates || {}, Tb);
                              b.retailerSettings.SA && (b.retailerSettings.SA.NewsfeedTemplates = SwymUtils.extendDefaults(b.retailerSettings.SA.NewsfeedTemplates || {}, Ub));
                              k.innerHTML = e;
                              document.body.appendChild(k);
                              b.ui = new SwymUI({});
                              c.NotificationOnly && b.ui.disable();
                              b.triggerSwymEvent(b.JSEvents.renderUI, sa, k);
                              setTimeout(function () {
                                  b.ui.onStylesLoaded();
                                  a && a(!0);
                              });
                          });
                      });
          };
          f.prototype.setupUIModule = function (a, b, c, d, e, g) {
              this.evtLayer.addEventListener(this.JSEvents.initIntegrations, function (k) {
                  k = h.getApp(a);
                  var m = h.retailerSettings[b];
                  h.hasSAWithAppEnabled(b) ||
                      (null != k && k.enabled) ||
                      c.forEach(function (a) {
                          m[a] = !1;
                      });
                  m.Enabled && ((k = m.ToggleSwitchState), void 0 == k || k || (m.Enabled = !1));
                  m.Enabled
                      ? (d(),
                        h.evtLayer.addEventListener(h.JSEvents.customizeStyleFromSettings, function (a) {
                            e(a.detail.d);
                        }))
                      : g && g();
              });
          };
          f.prototype.hasSAWithAppEnabled = function (a) {
              var b = this.getApp("ShoppingAssistant");
              return b && 1 == b.enabled && this.retailerSettings.SA.Enabled && this.retailerSettings[a].Enabled;
          };
          f.prototype.isSimpleWishlistOnly = function () {
              return this.retailerSettings ? this.getApp("Wishlist") && this.retailerSettings.UI.SimpleWishlistOnly : !1;
          };
          f.prototype.checkNonFetchUI = function () {
              if (this.retailerSettings) {
                  this.getApps();
                  var a = { enabled: !1 },
                      b = this.getApp("Wishlist") || a,
                      a = this.getApp("ShoppingAssistant") || a,
                      b = !b.enabled;
                  this.nonFetchUI = !a.enabled && b;
              } else this.nonFetchUI = !0;
          };
          f.prototype.isNonFetchUI = function () {
              "undefined" == typeof this.nonFetchUI && this.checkNonFetchUI();
              return this.nonFetchUI;
          };
          f.prototype.isCollectionsEnabled = function () {
              return this.retailerSettings ? this.retailerSettings.Wishlist.EnableCollections : !1;
          };
          (function () {
              function a(a) {
                  if (!(0 in arguments)) throw new TypeError("1 argument is required");
                  do if (this === a) return !0;
                  while ((a = a && a.parentNode));
                  return !1;
              }
              if ("HTMLElement" in this && "contains" in HTMLElement.prototype)
                  try {
                      delete HTMLElement.prototype.contains;
                  } catch (b) {}
              "Node" in this ? (Node.prototype.contains = a) : (document.contains = Element.prototype.contains = a);
          })();
          (function () {
              window.SwymUtils = window.SwymUtils || {};
              SwymUtils.Mustache = window.Mustache;
              SwymUtils.isElementAvailable = function (a) {
                  return 0 < document.querySelectorAll(a).length;
              };
              SwymUtils.getElementText = function (a, c) {
                  var d = document.querySelector(a);
                  return d ? d.textContent : c;
              };
              SwymUtils.addClass = function (a, c) {
                  a.classList
                      ? c.split(" ").forEach(function (c) {
                            a.classList.add(c);
                        })
                      : (a.className += " " + c);
              };
              SwymUtils.removeClass = function (a, c) {
                  a.classList
                      ? c.split(" ").forEach(function (c) {
                            a.classList.remove(c);
                        })
                      : (a.className = a.className.replace(new RegExp("(^|\\b)" + c.split(" ").join("|") + "(\\b|$)", "gi"), " "));
              };
              SwymUtils.removeSelectedElement = function (a) {
                  a && (a = document.querySelector(a)) && a.parentNode.removeChild(a);
              };
              SwymUtils.showElem = function (a, c) {
                  a && (a.style.display = c || "");
              };
              SwymUtils.hideElem = function (a, c) {
                  a && (a.style.display = c || "none");
              };
              SwymUtils.hasClass = function (a, c) {
                  return a.classList ? a.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(a.className);
              };
              SwymUtils.toggleClass = function (a, c) {
                  if (a.classList) return a.classList.toggle(c);
                  for (var d = a.className.split(" "), e = -1, g = d.length; g--; ) d[g] === c && (e = g);
                  g = !1;
                  0 <= e ? d.splice(e, 1) : (d.push(c), (g = !0));
                  a.className = d.join(" ");
                  return g;
              };
              SwymUtils.addElementDOMEventListener = function (a, c, d, e, g) {
                  a = c.querySelectorAll(a);
                  [].forEach.call(
                      a,
                      function (a) {
                          a.addEventListener(d, function (a) {
                              e.call(g, a);
                          });
                      },
                      this
                  );
              };
              SwymUtils.addDOMEventListener = function (a, c, d, e) {
                  SwymUtils.addElementDOMEventListener(a, document, c, d, e);
              };
              SwymUtils.elemOffset = function (a) {
                  var c, d;
                  d = a.getBoundingClientRect();
                  if (d.width || d.height || a.getClientRects().length) return (c = a.ownerDocument), (a = window), (c = c.documentElement), { top: d.top + a.pageYOffset - c.clientTop, left: d.left + a.pageXOffset - c.clientLeft };
              };
              SwymUtils.elemPosition = function (a) {
                  a = SwymUtils.elemOffset(a);
                  return {
                      top: a.top - (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
                      left: a.left - (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0),
                  };
              };
              SwymUtils.modalPosition = function (a, c, d) {
                  var e = {},
                      g = SwymUtils.elemPosition(a),
                      k = SwymUtils.viewport();
                  e.top = Math.min(g.top + a.offsetHeight + 15, k.height - d - 15);
                  650 > k.width
                      ? ((e.top = Math.min(150, e.top)), (e.left = e.right = 15))
                      : ((e.left = Math.min(g.left - a.offsetWidth - 15 - c / 4, k.width - c - 15)), (e.left = Math.max(15, e.left)), (e.right = Math.max(k.width - (e.left + c), 15)));
                  return e;
              };
              SwymUtils.onDOMReady = function (a, c) {
                  "loading" != document.readyState
                      ? a(c)
                      : document.addEventListener("DOMContentLoaded", function () {
                            a(c);
                        });
              };
              SwymUtils.findAncestor = function (a, c) {
                  for (; (a = a.parentElement) && !a.classList.contains(c); );
                  return a;
              };
              SwymUtils.addEvent = function (a, c, d) {
                  a.attachEvent ? a.attachEvent("on" + c, d) : a.addEventListener(c, d);
              };
              SwymUtils.addEventDelegate = function (a, c, d, e) {
                  a.addEventListener(c, function (c) {
                      for (var k = a.querySelectorAll(d), m = c.target, f = 0, n = k.length; f < n; f++)
                          for (var h = m, C = k[f]; h && h !== a; ) {
                              if (h === C) return e.call(C, c);
                              h = h.parentNode;
                          }
                  });
              };
              SwymUtils.forEachElement = function (a, c, d) {
                  a = (d || document).querySelectorAll(a);
                  for (d = 0; d < a.length; d++) c(a[d], d);
              };
              SwymUtils.createElement = function (a) {
                  var c = document.createDocumentFragment(),
                      d = document.createElement("div");
                  d.innerHTML = a;
                  node = d.children[0];
                  c.appendChild(node);
                  return node;
              };
              SwymUtils.viewport = function () {
                  var a = window,
                      c = "inner";
                  "innerWidth" in window || ((c = "client"), (a = document.documentElement || document.body));
                  return { width: a[c + "Width"], height: a[c + "Height"] };
              };
              SwymUtils.isTouchDevice = function () {
                  return "ontouchstart" in window || 0 < navigator.MaxTouchPoints || 0 < navigator.msMaxTouchPoints;
              };
              SwymUtils.getClosest = function (a, c) {
                  for (var d = c.charAt(0); a && a !== document; a = a.parentNode)
                      if (("." === d && a.classList.contains(c.substr(1))) || ("#" === d && a.id === c.substr(1)) || ("[" === d && a.hasAttribute(c.substr(1, c.length - 2))) || a.tagName.toLowerCase() === c) return a;
                  return !1;
              };
              SwymUtils.getParent = function (a) {
                  return (a = a.parentNode) && 11 !== a.nodeType ? a : null;
              };
              SwymUtils.removeEvent = function (a, c, d) {
                  a.detachEvent ? a.detachEvent("on" + c, d) : a.removeEventListener(c, d);
              };
              var a = {};
              SwymUtils.loadTemplate = function (b) {
                  var c = a[b];
                  if (!c) {
                      c = document.getElementById(b);
                      if (!c) return SwymUtils.warn("Error cannot find the template #" + b), !1;
                      c = c.innerHTML.trim();
                      Mustache.parse(c);
                      a[Ua] = c;
                  }
                  return c;
              };
              SwymUtils.renderTemplate = function (a, c) {
                  var d = SwymUtils.loadTemplate(a);
                  if (!d) throw Error("Invalid Template", a);
                  return SwymUtils.renderTemplateString(d, c);
              };
              SwymUtils.renderTemplateString = function (a, c) {
                  return Mustache.render(a, c);
              };
              SwymUtils.equalsIgnoreCase = function (a, c) {
                  return null == a ? !1 : a.toUpperCase() == c.toUpperCase();
              };
              SwymUtils.extendDefaults = function (a, c) {
                  for (var d in c) a.hasOwnProperty(d) || (a[d] = c[d]);
                  return a;
              };
              SwymUtils.insertBefore = function (a, c) {
                  var d = SwymUtils.createElement(a);
                  c.insertAdjacentElement("beforebegin", d);
              };
              SwymUtils.forEachNodeElem = function (a, c) {
                  for (var d = 0, e = a.length; d < e; d++) c(a[d]);
              };
              SwymUtils.appendNode = function (a, c, d) {
                  d.parentNode.insertBefore(c, "before" === a ? d : d.nextSibling);
              };
          })();
          f.prototype.swymApi = function (a) {
              a.method = "GET";
              this.swymApiBase(a);
          };
          f.prototype.swymApiPost = function (a) {
              a.method = "POST";
              this.swymApiBase(a);
          };
          f.prototype.swymApiPut = function (a) {
              a.method = "PUT";
              this.swymApiBase(a);
          };
          f.prototype.swymApiDelete = function (a) {
              a.method = "DELETE";
              this.swymApiBase(a);
          };
          f.prototype.swymApiBase = function (a) {
              a.params && a.params.event && ub(a.params.event);
              D(a, { method: "GET", avoidPid: !1, checkRegId: !0, sendSessionId: !0, v2: !1, v3: !1, sendRegId: !0, waitForRegister: !1 });
              var b = this,
                  c = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
              c.onreadystatechange = function () {
                  b.handleSwymResponse(c, a.callbackFn, a.errorFn, a.params, a);
              };
              a.v3 ? this.sendRequestV3(c, a) : a.v2 ? this.sendRequestV2(c, a) : this.sendRequest(c, a);
          };
          f.prototype.constructSwymUri = function (a, b) {
              b || (b = {});
              var c = this.swymHost + a,
                  d = !0,
                  e;
              for (e in b) {
                  var g = b[e];
                  T(g) || (d ? ((c += "?"), (d = !1)) : (c += "&"), "object" === typeof g && (g = JSON.stringify(g)), (c += e + "=" + encodeURIComponent(g)));
              }
              return c;
          };
          f.prototype.constructSwymEndpoint = function (a) {
              return this.swymHost + a;
          };
          f.prototype.processParams = function (a, b) {
              var c;
              if ("GET" == a) {
                  b || (b = {});
                  c = "";
                  var d = !0,
                      e;
                  for (e in b) {
                      var g = b[e];
                      T(g) || (d ? ((c += "?"), (d = !1)) : (c += "&"), "object" === typeof g && (g = JSON.stringify(g)), (c += e + "=" + encodeURIComponent(g)));
                  }
              } else c = b ? JSON.stringify(b) : "";
              c = { params: b, returnVal: c };
              this.triggerSwymEvent(f.JSEvents.requestParams, { d: c });
              return c.returnVal;
          };
          f.prototype.processParamsV2 = function (a, b) {
              b || (b = {});
              var c = "",
                  d = !0,
                  e;
              for (e in b) {
                  var g = b[e];
                  T(g) || (d ? ("GET" == a && (c += "?"), (d = !1)) : (c += "&"), "object" === typeof g && (g = JSON.stringify(g)), (c += e + "=" + encodeURIComponent(g)));
              }
              c = { params: b, returnVal: c };
              this.triggerSwymEvent(f.JSEvents.requestParams, { d: c });
              return c.returnVal;
          };
          f.prototype.sendRequest = function (a, b) {
              var c = this.session.getSessionId(),
                  d = this.get(this.key.PID),
                  e = this.get(this.key.REGID),
                  g = b.endpoint,
                  k = b.method,
                  m = b.params;
              if (b.checkRegId && !e) {
                  SwymUtils.log("No regid found, wait for registration to finish");
                  var p = this;
                  this.isRegistering || b.waitForRegister
                      ? this.evtLayer.addEventListener(f.JSEvents.registered, function C() {
                            SwymUtils.log("Registration finished, continuing");
                            p.sendRequest(a, b);
                            p.evtLayer.removeEventListener(f.JSEvents.registered, C);
                        })
                      : (SwymUtils.log("Registration triggered"),
                        this.refresh(function () {
                            SwymUtils.log("Registration finished, continuing");
                            p.sendRequest(a, b);
                        }));
              } else {
                  var n = this.swymHost + "/api";
                  b.avoidPid || (n += "/provider/pid");
                  n += g;
                  b.avoidPid || ((d = d || m.pid), "GET" == k ? ((m = m || {}), (m.pid = d)) : (n += "?pid=" + encodeURIComponent(d)));
                  d = this.processParams(k, m);
                  "GET" == k && ((n += d), (d = null));
                  c = { method: k, url: n, options: b, params: d, regid: e, sessionid: c };
                  this.triggerSwymEvent(f.JSEvents.requestOptions, { d: c });
                  a.open(c.method, c.url, !0);
                  c.regid && c.options.sendRegId && a.setRequestHeader("x-swym-regid", c.regid);
                  c.sessionid && c.options.sendSessionId && a.setRequestHeader("x-swym-sessionid", c.sessionid);
                  "GET" != c.method && a.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                  a.send(c.params);
                  SwymUtils.log("> " + c.method + " " + c.url);
              }
          };
          f.prototype.sendRequestV2 = function (a, b) {
              var c = this.session.getSessionId(),
                  d = this.get(this.key.PID),
                  e = this.get(this.key.REGID),
                  g = b.endpoint,
                  k = b.method,
                  m = b.params || {};
              if (b.checkRegId && !e) {
                  SwymUtils.log("No regid found, wait for registration to finish");
                  var p = this;
                  this.isRegistering || b.waitForRegister
                      ? this.evtLayer.addEventListener(f.JSEvents.registered, function C() {
                            SwymUtils.log("Registration finished, continuing");
                            p.sendRequestV2(a, b);
                            p.evtLayer.removeEventListener(f.JSEvents.registered, C);
                        })
                      : (SwymUtils.log("Registration triggered"),
                        this.refresh(function () {
                            SwymUtils.log("Registration finished, continuing");
                            p.sendRequestV2(a, b);
                        }));
              } else if (this.waitForCustomerRefresh && !b.customerRefresh)
                  SwymUtils.log("Waiting for customer refresh to finish"),
                      (p = this),
                      this.evtLayer.addEventListener(f.JSEvents.customerInfoRefreshed, function C() {
                          SwymUtils.log("Refresh finished, continuing");
                          p.sendRequestV2(a, b);
                          p.evtLayer.removeEventListener(f.JSEvents.customerInfoRefreshed, C);
                      });
              else {
                  var n = this.swymHost + "/api/v2";
                  b.avoidPid || (n += "/provider");
                  n += g;
                  e && b.sendRegId && (m.regid = e);
                  c && b.sendSessionId && (m.sessionid = c);
                  b.avoidPid || ((d = d || m.pid), "GET" == k ? (m.pid = d) : (n += "?pid=" + encodeURIComponent(d)));
                  d = this.processParamsV2(k, m);
                  "GET" == k && ((n += d), (d = null));
                  c = { method: k, url: n, options: b, params: d, regid: e, sessionid: c };
                  this.triggerSwymEvent(f.JSEvents.requestOptions, { d: c });
                  a.open(c.method, c.url, !0);
                  "GET" != c.method && a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                  a.send(c.params);
                  SwymUtils.log("> " + c.method + " " + c.url);
              }
          };
          f.prototype.sendRequestV3 = function (a, b) {
              var c = this.session.getSessionId(),
                  d = this.get(this.key.PID),
                  e = this.get(this.key.REGID),
                  g = b.endpoint,
                  k = b.method,
                  m = b.params || {};
              if (b.checkRegId && !e) {
                  SwymUtils.log("No regid found, wait for registration to finish");
                  var p = this;
                  this.isRegistering || b.waitForRegister
                      ? this.evtLayer.addEventListener(f.JSEvents.registered, function C() {
                            SwymUtils.log("Registration finished, continuing");
                            p.sendRequestV3(a, b);
                            p.evtLayer.removeEventListener(f.JSEvents.registered, C);
                        })
                      : (SwymUtils.log("Registration triggered"),
                        this.refresh(function () {
                            SwymUtils.log("Registration finished, continuing");
                            p.sendRequestV3(a, b);
                        }));
              } else {
                  var n = this.swymHost + "/api/v3";
                  b.avoidPid || b.noProvider || (n += "/provider");
                  n += g;
                  e && b.sendRegId && (m.regid = e);
                  c && b.sendSessionId && (m.sessionid = c);
                  b.avoidPid || ((d = d || m.pid), "GET" == k ? (m.pid = d) : (n += "?pid=" + encodeURIComponent(d)));
                  d = this.processParamsV2(k, m);
                  "GET" == k && ((n += d), (d = null));
                  c = { method: k, url: n, options: b, params: d, regid: e, sessionid: c };
                  this.triggerSwymEvent(f.JSEvents.requestOptions, { d: c });
                  a.open(c.method, c.url, !0);
                  "GET" != c.method && a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                  a.send(c.params);
                  SwymUtils.log("> " + c.method + " " + c.url);
              }
          };
          f.prototype.handleSwymResponse = function (a, b, c, d, e) {
              if (4 == a.readyState)
                  if ($a(a)) {
                      if (b) {
                          SwymUtils.log("< GET " + a.status + ": " + JSON.stringify(g ? g : {}));
                          var g = ka(a.responseText);
                          b(g, a);
                      }
                  } else
                      a.status &&
                          (SwymUtils.error("Server API Error - " + a.status, Error("Server API Error - " + a.responseText + ", url - " + a.responseURL + ", data - " + JSON.stringify(d))), this.isBadRegid(a) && this.correctRegid(a, e)),
                          c && (SwymUtils.log("< GET " + a.status + "\n" + a.getAllResponseHeaders()), c(a.status, a));
          };
          f.prototype.isBadRegid = function (a) {
              var b = !1;
              400 == a.status &&
                  ((a = ka(a.responseText)),
                  "json-parse-exception" == a.type &&
                      "BadRegid" == a.message &&
                      ((b = this.storage.get(this.key.BADRID) || { ts: Date.now(), cnt: 0 }),
                      (b.cnt += 1),
                      this.storage.setSessionData(this.key.BADRID, b),
                      SwymUtils.error("Bad Regid counted - " + b.cnt + " - " + b.ts, Error("BadRegidCounted"), b),
                      5 < b.cnt
                          ? (this.storage.remove(this.key.REGID),
                            this.storage.remove(this.key.INSTRMAP),
                            this.deviceCache.putObject({}),
                            SwymUtils.error("Bad Regid cleared - " + this.storage.get(this.key.REGID), Error("BadRegidCleared"), { r: this.key.REGID, i: this.key.INSTRMAP }))
                          : SwymUtils.error("Bad Regid skipped delete", Error("BadRegid")),
                      (b = !0)));
              return b;
          };
          f.prototype.correctRegid = function (a, b) {
              var c = this.deviceCache.getObject(),
                  d = this;
              (c = c && c["current-device-id"]) &&
                  this.swymApiPost({
                      v2: !0,
                      sendRegId: !1,
                      sendSessionId: !1,
                      checkRegId: !1,
                      endpoint: "/correct-reg",
                      params: { di: c },
                      callbackFn: function (a, c) {
                          var k = a.regid;
                          k ? (d.set(d.key.REGID, k), d.triggerSwymEvent(f.JSEvents.regidRefreshed, k), d.correctInstrumentation(k), d.swymApiBase(b)) : SwymUtils.error("Unable to reconcile regid 200 - ", {}, a);
                      },
                      errorFn: function (a) {
                          SwymUtils.error("Unable to reconcile regid - ", {}, a);
                      },
                  });
          };
          (function () {
              window.SwymUtils = window.SwymUtils || {};
              var a = RegExp("([^?=&]+)(=([^&]*))?", "g");
              SwymUtils.getEncodedAsObject = function (b, c) {
                  var d = {};
                  try {
                      b.replace(a, function (a, b, e, m) {
                          a = decodeURIComponent(m);
                          d[b] = c ? c(a) : a;
                      });
                  } catch (e) {
                      SwymUtils.error("Invalid URI passed - " + b, e);
                  }
                  return d;
              };
              SwymUtils.getObjectAsEncoded = function (a) {
                  var b = [],
                      c;
                  for (c in a) a.hasOwnProperty(c) && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
                  return b.join("&");
              };
              SwymUtils.getObjectAsEncodedNested = function (a, b, c) {
                  c = c || [];
                  b = b || "__$key$__";
                  for (var d in a) a.hasOwnProperty(d) && ("object" == typeof a[d] ? this.getObjectAsEncodedNested(a[d], d + "[__$key$__]", c) : c.push(encodeURIComponent(b.replace("__$key$__", d)) + "=" + encodeURIComponent(a[d])));
                  return c.join("&");
              };
              SwymUtils.log = function (a, b) {
                  getSwymConfig().debug && console.log("Swym", a);
              };
              SwymUtils.warn = function (a, b) {
                  console.warn("Swym", a);
              };
              SwymUtils.error = function (a, b, c) {
                  console.error("Swym", a, b, c);
                  window._SwymLTracker && _SwymLTracker.push({ msg: a, category: "Swym-Error", exception: { name: b.name, message: b.message, stack: b.stack, url: JSON.stringify(location.href), obj: c } });
              };
              SwymUtils.annotateLog = function (a) {
                  var b = typeof a;
                  if (!a || ("object" !== b && "string" !== b)) return a;
                  "string" === b && (a = { text: a });
                  b = (b = O.deviceCache.getObject()) && b["current-device-id"];
                  a.regid = O.getSwymRegistrationId();
                  a.deviceid = b;
                  a.useragent = window.navigator.userAgent;
                  a.v = va;
                  a.url = location.href;
                  a.pid = O.get(O.key.PID);
                  return a;
              };
              SwymUtils.annotateUrl = function (a, b, c, d) {
                  if (!a || "string" !== typeof a) return a;
                  a = -1 != a.indexOf("?") ? a + "&" : a + "?";
                  return (a += "utm_source=" + h.SwymPrefix + b + "&utm_medium=" + c + "&utm_term=" + d + "&utm_campaign=" + d);
              };
              SwymUtils.loadHTML = function (a, b, c) {
                  SwymUtils.ajaxGET(
                      a,
                      function (a) {
                          if (200 == a.status) {
                              var d = document.createElement("div");
                              d.innerHTML = a.responseText;
                              b(d, a);
                          } else c(a.status, a);
                      },
                      null
                  );
              };
              SwymUtils.isPresentInURL = function (a, b) {
                  b = b || location.href;
                  return -1 != b.search(a);
              };
              SwymUtils.matchURLInArray = function (a, b) {
                  if (!a) return null;
                  b = b || location.href;
                  for (var c = 0; c < a.length; c++) {
                      var d = a[c];
                      if (-1 != b.search(new RegExp(d, "i"))) return d;
                  }
                  return null;
              };
              SwymUtils.ajax = function (a, b, c, d, e) {
                  SwymUtils.ajaxOpt({ method: a, url: b, data: c, callback: d, ctx: e });
              };
              SwymUtils.ajaxOpt = function (a) {
                  var b = a.data,
                      c = a.callback,
                      d = a.ctx,
                      e = a.headers,
                      g = new XMLHttpRequest();
                  g.open(a.method, a.url, !0);
                  g.timeout = 1e4;
                  g.onreadystatechange = function () {
                      4 == g.readyState && c && c.apply(d, [g]);
                  };
                  a = !1;
                  if (e) for (var k in e) g.setRequestHeader(k, e[k]), "Content-Type" == k && (a = !0);
                  b && !a && g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                  g.send(b);
              };
              SwymUtils.ajaxGET = function (a, b, c) {
                  this.ajax("GET", a, null, b, c);
              };
              var b = "epi pt iu variants pr op bt qty du dt ct pt".split(" ");
              SwymUtils.copyProductData = function (a, c) {
                  b.forEach(function (b) {
                      "undefined" != typeof c[b] && "" !== c[b] && (a[b] = c[b]);
                  });
                  a.epi = "" + a.epi;
                  return a;
              };
              SwymUtils.getPageURL = function () {
                  var a = document.querySelector("link[rel=canonical]");
                  return a ? a.href : document.URL;
              };
              SwymUtils.getPageURLAsLocation = function () {
                  return SwymUtils.getURLAsLocation(SwymUtils.getPageURL());
              };
              SwymUtils.getURLAsLocation = function (a) {
                  var b = document.createElement("a");
                  b.href = a;
                  return b;
              };
              var c = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
              SwymUtils.validateEmail = function (a) {
                  return c.test(a);
              };
              var d = /^\+?(?:[0-9] ?){6,14}[0-9]$/;
              SwymUtils.validatePhoneNumber = function (a) {
                  return d.test(a);
              };
              var e = /^\d{6}$/;
              SwymUtils.validateOTP = function (a) {
                  return e.test(a);
              };
              SwymUtils.validateUrl = function (a) {
                  return -1 < a.search(/http:|https:/);
              };
              SwymUtils.getHashCode = function (a) {
                  var b = 0,
                      c,
                      d,
                      e;
                  if (0 === a.length) return b;
                  c = 0;
                  for (e = a.length; c < e; c++) (d = a.charCodeAt(c)), (b = (b << 5) - b + d), (b |= 0);
                  return b;
              };
              SwymUtils.getBodyTemplate = function (a) {
                  if (null == $templateCache_bodyhtml) {
                      var b = getSwymConfig().assets + "swym-body.js";
                      SwymUtils.loadJsCssfile(b, "js", function () {
                          SwymUtils.getBodyTemplate(a);
                      });
                  } else
                      setTimeout(function () {
                          a($templateCache_bodyhtml);
                          $templateCache_bodyhtml = null;
                      }, 10);
              };
              SwymUtils.getStylesTemplate = function (a) {
                  var b = getSwymConfig().assets + "swym-styles.js";
                  try {
                      $templateCache_styleshtml
                          ? setTimeout(function () {
                                a($templateCache_styleshtml);
                                $templateCache_styleshtml = null;
                            }, 100)
                          : SwymUtils.loadJsCssfile(b, "js", function () {
                                SwymUtils.getStylesTemplate(a);
                            });
                  } catch (c) {
                      SwymUtils.loadJsCssfile(b, "js", function () {
                          SwymUtils.getStylesTemplate(a);
                      });
                  }
              };
              SwymUtils.loadResFile = SwymUtils.loadJsCssfile = function (a, b, c, d) {
                  var e = document.body;
                  e || (e = document.documentElement);
                  "js" == b
                      ? ((d = document.createElement("script")), d.setAttribute("type", "text/javascript"), (d.async = !1), c && (d.onload = c), d.setAttribute("src", a), e.appendChild(d))
                      : "image" == b
                      ? ((b = new Image()), (b.onerror = d || c), (b.onload = c), (b.src = a))
                      : "css" == b &&
                        ((d = document.createElement("link")),
                        d.setAttribute("rel", "stylesheet"),
                        d.setAttribute("type", "text/css"),
                        d.setAttribute("href", a),
                        c && ("onload" in d ? (d.onload = c) : ((b = new Image()), (b.onerror = c), (b.src = a))),
                        e.appendChild(d));
              };
              SwymUtils.notifyVibrate = function () {
                  window.navigator.vibrate && window.navigator.vibrate(200);
              };
              SwymUtils.getOGData = function () {
                  for (var a = document.querySelectorAll("meta[property^=og],meta[name^=og],meta[name^=product],meta[property^=product]"), b = a.length, c = {}, d = 0; d < b; d++) {
                      var e = a[d],
                          g = e.getAttribute("property") || e.getAttribute("name");
                      (e = e.getAttribute("content")) && (c[g] = e);
                  }
                  return c;
              };
              var g = { "og:title": "dt", "og:image": "iu", "og:price:amount": "pr", "og:price:standard_amount": "op", "product:original_price:amount": "op", "product:price:amount": "pr" };
              SwymUtils.getOGDataAsPageMap = function () {
                  var a = this.getOGData();
                  if ("product" == a["og:type"]) {
                      var b = { et: f.EventTypes.productView },
                          c;
                      for (c in g) a[c] && (b[g[c]] = a[c]);
                      return b;
                  }
                  return null;
              };
              SwymUtils.EmptyFunction = function () {};
              SwymUtils.Iterator = function (a, b, c, d) {
                  this.arr = a;
                  this.length = a.length;
                  this.curr = -1;
                  this.stepFn = b;
                  this.startFn = c || EmptyFunction;
                  this.endFn = d || EmptyFunction;
              };
              SwymUtils.Iterator.prototype.step = function () {
                  this.curr++;
                  0 == this.curr && this.doStart();
                  this.curr >= this.arr.length ? this.doEnd(this) : this.stepFn(this);
              };
              SwymUtils.Iterator.prototype.current = function () {
                  return this.arr[this.curr];
              };
              SwymUtils.Iterator.prototype.doStart = function () {
                  this.startFn(this);
              };
              SwymUtils.Iterator.prototype.doEnd = function () {
                  this.endFn(this);
              };
              SwymUtils.Iterator.prototype.startAsync = function () {
                  var a = this;
                  this.itemsToProcess = this.arr.length;
                  this.arr.forEach(function (b) {
                      a.stepFn(b);
                  });
              };
              SwymUtils.Iterator.prototype.stepAsync = function () {
                  --this.itemsToProcess;
                  0 == this.itemsToProcess && this.endFn();
              };
              SwymUtils.removeHash = function () {
                  var a,
                      b,
                      c = window.location;
                  "pushState" in history || ((a = document.body.scrollTop), (b = document.body.scrollLeft), (c.hash = ""), (document.body.scrollTop = a), (document.body.scrollLeft = b));
              };
              SwymUtils.removeComma = function (a) {
                  "string" == typeof a && (a = a.replace(/,/gi, ""));
                  return a;
              };
              SwymUtils.getSWAction = function () {
                  return (SwymUtils.getParameterByName("swaction") || "").toLowerCase();
              };
              SwymUtils.isUndefined = function (a) {
                  return "undefined" == typeof a;
              };
              SwymUtils.setDefaults = D;
              SwymUtils.getParameterByName = xa;
              SwymUtils.isHttpSuccess = $a;
              SwymUtils.getHostedURL = function () {
                  return "/apps/swymWishlist/wishlist/index.php";
              };
              SwymUtils.onHostedUI = function () {
                  return -1 < window.location.pathname.indexOf(SwymUtils.getHostedURL());
              };
              SwymUtils.turnOffInstrumentation = function () {
                  this._dontInstrument = !0;
              };
              SwymUtils.turnOnInstrumentation = function () {
                  delete this._dontInstrument;
              };
              SwymUtils.appendCustomCSS = function (a) {
                  document.querySelector("#swym-styles").querySelector("style:last-child").innerHTML += a;
              };
              var k = /bot|googlebot|crawler|spider|robot|crawling|yandex|Google Web Preview|BingPreview/i;
              SwymUtils.isBot = function () {
                  return k.test(navigator.userAgent);
              };
              SwymUtils.preventDefault = function (a) {
                  a.preventDefault();
              };
              SwymUtils.debounce = function (a, b, c) {
                  var d = null;
                  c = c || 1;
                  var e = 0;
                  return function () {
                      var g = this,
                          k = arguments;
                      clearTimeout(d);
                      e++;
                      d = setTimeout(function () {
                          d = null;
                          e = 0;
                          a.apply(g, k);
                      }, b * Math.min(e, c));
                  };
              };
              SwymUtils.serializeForm = function (a, b) {
                  if (a && "FORM" === a.nodeName) {
                      var c,
                          d,
                          e = [];
                      for (c = a.elements.length - 1; 0 <= c; --c)
                          if ("" !== a.elements[c].name)
                              switch (a.elements[c].nodeName) {
                                  case "INPUT":
                                      switch (a.elements[c].type) {
                                          case "text":
                                          case "email":
                                          case "hidden":
                                          case "password":
                                          case "button":
                                          case "reset":
                                          case "submit":
                                              e.push(a.elements[c].name + "=" + encodeURIComponent(a.elements[c].value));
                                              break;
                                          case "checkbox":
                                          case "radio":
                                              a.elements[c].checked && e.push(a.elements[c].name + "=" + encodeURIComponent(a.elements[c].value));
                                      }
                                      break;
                                  case "TEXTAREA":
                                      e.push(a.elements[c].name + "=" + encodeURIComponent(a.elements[c].value));
                                      break;
                                  case "SELECT":
                                      switch (a.elements[c].type) {
                                          case "select-one":
                                              e.push(a.elements[c].name + "=" + encodeURIComponent(a.elements[c].value));
                                              break;
                                          case "select-multiple":
                                              for (d = a.elements[c].options.length - 1; 0 <= d; --d) a.elements[c].options[d].selected && e.push(a.elements[c].name + "=" + encodeURIComponent(a.elements[c].options[d].value));
                                      }
                                      break;
                                  case "BUTTON":
                                      switch (a.elements[c].type) {
                                          case "reset":
                                          case "submit":
                                          case "button":
                                              e.push(a.elements[c].name + "=" + encodeURIComponent(a.elements[c].value));
                                      }
                              }
                      c = e.join("&");
                      return b ? SwymUtils.getEncodedAsObject(c) : c;
                  }
              };
              SwymUtils.whichTransitionEvent = function () {
                  var a,
                      b = document.createElement("fakeelement"),
                      c = { transition: "transitionend", OTransition: "oTransitionEnd", MozTransition: "transitionend", WebkitTransition: "webkitTransitionEnd" };
                  for (a in c) if (void 0 !== b.style[a]) return c[a];
              };
              SwymUtils.whichAnimationEvent = function () {
                  var a,
                      b = document.createElement("fakeelement"),
                      c = { animation: "animationend", OAnimation: "oAnimationEnd", MozAnimation: "animationend", WebkitAnimation: "webkitAnimationEnd" };
                  for (a in c) if (void 0 !== b.style[a]) return c[a];
              };
              SwymUtils.returnJSONParsed = function (a) {
                  return JSON.parse(a.match(/[{].*.[}]/));
              };
              SwymUtils.arrayPartition = function (a, b) {
                  return a.length ? [a.splice(0, b)].concat(SwymUtils.arrayPartition(a, b)) : [];
              };
              SwymUtils.deferredCallback = function (a, b) {
                  return setTimeout(function () {
                      a();
                  }, b);
              };
              SwymUtils.deepExtendDefaults = function (a, b) {
                  for (var c in b) {
                      var d = a[c];
                      SwymUtils.isUndefined(d) ? (a[c] = b[c]) : "object" != typeof a[c] || Array.isArray(d) || (a[c] = SwymUtils.deepExtendDefaults(d, b[c]));
                  }
                  return a;
              };
              SwymUtils.abbrNum = function (a, b) {
                  "undefined" == typeof b && (b = 2);
                  b = Math.pow(10, b);
                  for (var c = ["K", "M", "B", "T"], d = c.length - 1; 0 <= d; d--) {
                      var e = Math.pow(10, 3 * (d + 1));
                      if (e <= a) {
                          a = Math.round((a * b) / e) / b;
                          1e3 == a && d < c.length - 1 && ((a = 1), d++);
                          a += c[d];
                          break;
                      }
                  }
                  return a;
              };
              SwymUtils.formatProductPrice = function (a) {
                  a.cu = h.currency;
                  parseFloat(a.op) == parseFloat(a.pr) && delete a.op;
                  ["pr", "op"].forEach(function (b) {
                      "number" == typeof a[b] ? (a[b] = a[b].toFixed(2)) : isNaN(parseFloat(a[b])) || (a[b] = parseFloat(a[b]).toFixed(2));
                  });
                  return a;
              };
              Math.sign ||
                  (Math.sign = function (a) {
                      return (0 < a) - (0 > a) || +a;
                  });
              "function" != typeof Object.assign &&
                  Object.defineProperty(Object, "assign", {
                      value: function (a, b) {
                          if (null == a) throw new TypeError("Cannot convert undefined or null to object");
                          for (var c = Object(a), d = 1; d < arguments.length; d++) {
                              var e = arguments[d];
                              if (null != e) for (var g in e) Object.prototype.hasOwnProperty.call(e, g) && (c[g] = e[g]);
                          }
                          return c;
                      },
                      writable: !0,
                      configurable: !0,
                  });
              SwymUtils.timeSince = function (a) {
                  function b(a, c) {
                      return c + " " + O.retailerSettings.Strings[a + (1 < c ? "s" : "")] + " " + O.retailerSettings.Strings.Ago;
                  }
                  a = Math.floor((new Date() - a) / 1e3);
                  var c = Math.floor(a / 31536e3);
                  if (1 <= c) return b("Year", c);
                  c = Math.floor(a / 2592e3);
                  if (1 <= c) return b("Month", c);
                  c = Math.floor(a / 86400);
                  if (1 <= c) return b("Day", c);
                  c = Math.floor(a / 3600);
                  if (1 <= c) return b("Hour", c);
                  c = Math.floor(a / 60);
                  if (1 <= c) return b("Minute", c);
              };
              SwymUtils.formatDeviceCategory = function (a) {
                  if (!a) return "desktop";
                  a = a.toLowerCase();
                  return "tablet" == a ? "tablet" : "smartphone" == a ? "mobile" : "desktop";
              };
              SwymUtils.getCurrentPrimaryUrlWithProtocol = function () {
                  return window.location.protocol + "//" + O.getPrimaryDomain();
              };
              SwymUtils.getUrlWithoutProtocol = function (a) {
                  return a.replace(/https:\/\/|http:\/\//, "");
              };
              SwymUtils.deepcopy = function (a) {
                  return JSON.parse(JSON.stringify(a));
              };
              SwymUtils.isValidUserInput = function (a, b) {
                  return SwymUtils[a](b);
              };
              SwymUtils.stripScripts = function (a) {
                  for (var b = a.getElementsByTagName("script"), c = b.length; c--; ) b[c].parentNode.removeChild(b[c]);
                  return a;
              };
          })();
          f.JSEvents = f.prototype.JSEvents = {
              renderProducts: "sw:renderproducts",
              beforeRenderProducts: "sw:beforerenderproducts",
              renderInterestedProducts: "sw:renderinterestedproducts",
              renderNewsfeedProducts: "sw:rendernewsfeedproducts",
              beforeRenderProduct: "sw:beforerenderproduct",
              renderProduct: "sw:renderproduct",
              renderRelayUI: "sw:renderui",
              readyRelayUI: "sw:readyui",
              registered: "sw:registered",
              regidRefreshed: "sw:regidrefreshed",
              regidCleaned: "sw:regidcleaned",
              beforeRenderInterestedProducts: "sw:beforerenderinterestedproducts",
              beforeRenderNewsfeedProducts: "sw:beforerendernewsfeedproducts",
              beforeRenderNotification: "sw:beforerendernotification",
              renderNotification: "sw:rendernotification",
              configLoaded: "sw:configloaded",
              customizeStyleFromSettings: "sw:customizestylesettings",
              addedToWishlist: "sw:addedtowishlist",
              removedFromWishlist: "sw:removedfromwishlist",
              deletedFromRelay: "sw:deletedfromrelay",
              beforeCollect: "sw:beforecollect",
              trackedPageView: "sw:trackedPageView",
              relayOpened: "sw:uiopened",
              sessionStarted: "sw:sessionstarted",
              sessionCreated: "sw:sessioncreated",
              preReadFilters: "sw:prereadfilters",
              preReadApps: "sw:prereadapps",
              preReadSettings: "sw:prereadsettings",
              readFilters: "sw:readfilters",
              readApps: "sw:readapps",
              readSettings: "sw:readsettings",
              wishlistLinkLoaded: "sw:wishlistlinkloaded",
              watchlistLinkLoaded: "sw:watchlistlinkloaded",
              productImageError: "sw:productimageerror",
              externalRegisterDone: "sw:externalRegisterDone",
              renderUI: "sw:renderui",
              uiOpened: "sw:uiopened",
              readyUI: "sw:readyui",
              renderProductDetailSlide: "sw:renderproductdetailslide",
              refreshProductDetailSlide: "sw:refreshproductdetailslide",
              changeVariantProductDetailSlide: "sw:changevariantproductdetailslide",
              renderProductDetailSlideError: "sw:renderproductdetailslideerror",
              newProductTracked: "sw:newproducttracked",
              watchlistPopupOpened: "sw:watchlistpopupopened",
              triggerPermissionDialogOpened: "sw:triggerpermissiondialogopened",
              productInvalidOnLoad: "sw:productinvalidonload",
              customerInfoRefreshed: "sw:customerinforefreshed",
              requestOptions: "sw:requestoptions",
              requestParams: "sw:requestparams",
              productsCacheUpdated: "sw:productscacheupdated",
          };
          (function () {
              var a = window.CustomEvent;
              window.SwCustomEvent = (function () {
                  try {
                      var b = new a("cat", { detail: { foo: "bar" } });
                      return "cat" === b.type && "bar" === b.detail.foo;
                  } catch (c) {}
                  return !1;
              })()
                  ? a
                  : "function" === typeof document.createEvent
                  ? function (a, c) {
                        var d = document.createEvent("CustomEvent");
                        c ? d.initCustomEvent(a, c.bubbles, c.cancelable, c.detail) : d.initCustomEvent(a, !1, !1, void 0);
                        return d;
                    }
                  : function (a, c) {
                        var d = document.createEventObject();
                        d.type = a;
                        c ? ((d.bubbles = Boolean(c.bubbles)), (d.cancelable = Boolean(c.cancelable)), (d.detail = c.detail)) : ((d.bubbles = !1), (d.cancelable = !1), (d.detail = void 0));
                        return d;
                    };
          })();
          f.prototype.triggerSwymEvent = function (a, b, c) {
              this.extendSession();
              a = new SwCustomEvent(a, { detail: { d: b, e: c } });
              this.evtLayer.dispatchEvent(a);
              return a;
          };
          f.prototype.extendSession = SwymUtils.debounce(function () {
              this.session.getSessionId();
          }, 100);
          var vb = [],
              h;
          P.prototype.init = function () {
              var a = h.get(h.key.CLCTMAP);
              a || (a = {});
              if (this.isValid() && (!a.hasOwnProperty(btoa(this.id)) || a[btoa(this.id)] < this.listenThreshold)) {
                  var b = this;
                  "jsonp" == this.type
                      ? ((a = new MutationObserver(function (a) {
                            a.forEach(function (a) {
                                for (var c = 0; c < a.addedNodes.length; c++) {
                                    var g = a.addedNodes[c];
                                    try {
                                        var k = g.src;
                                        if ("script" == g.tagName.toLowerCase() && -1 < k.toLowerCase().indexOf(b.id.toLowerCase())) {
                                            var f = SwymUtils.getEncodedAsObject(k);
                                            b.detect(f);
                                        }
                                    } catch (h) {}
                                }
                            });
                        })),
                        a.observe(b.target, { childList: !0 }),
                        (this.listener = a))
                      : "form" == this.type
                      ? ((a = function (a) {
                            try {
                                var d = SwymUtils.serializeForm(b.target, !0);
                                b.detect(d, a);
                            } catch (e) {}
                        }),
                        this.target.addEventListener("submit", a),
                        (this.listener = a))
                      : "xhrpost" == this.type
                      ? ((a = function (a) {
                            a = a.detail.d;
                            if (-1 < a._swAction.toLowerCase().indexOf(b.id.toLowerCase()))
                                try {
                                    if ("json" == b.contentType) var d = JSON.parse(a._swData);
                                    else "urlencoded" == b.contentType && (d = SwymUtils.getEncodedAsObject(a._swData));
                                    b.detect(d, a);
                                } catch (e) {}
                        }),
                        h.evtLayer.addEventListener(h.JSEvents.xhrTrap, a),
                        (this.listener = a))
                      : "xhrget" == this.type
                      ? ((a = function (a) {
                            a = a.detail.d;
                            if (-1 < a._swAction.toLowerCase().indexOf(b.id.toLowerCase()))
                                try {
                                    var d = SwymUtils.getEncodedAsObject(a._swAction);
                                    b.detect(d, a);
                                } catch (e) {}
                        }),
                        h.evtLayer.addEventListener(h.JSEvents.xhrTrap, a),
                        (this.listener = a))
                      : "fetchpost" == this.type
                      ? ((a = function (a) {
                            a = a.detail.d;
                            if (-1 < a._swAction.toLowerCase().indexOf(b.id.toLowerCase()))
                                try {
                                    if ("json" == b.contentType) var d = JSON.parse(a._swData);
                                    else "urlencoded" == b.contentType && (d = SwymUtils.getEncodedAsObject(a._swData));
                                    b.detect(d, a);
                                } catch (e) {}
                        }),
                        h.evtLayer.addEventListener(h.JSEvents.fetchTrap, a),
                        (this.listener = a))
                      : "fetchget" == this.type
                      ? ((a = function (a) {
                            a = a.detail.d;
                            if (-1 < a._swAction.toLowerCase().indexOf(b.id.toLowerCase()))
                                try {
                                    var d = SwymUtils.getEncodedAsObject(a._swAction);
                                    b.detect(d, a);
                                } catch (e) {}
                        }),
                        h.evtLayer.addEventListener(h.JSEvents.fetchTrap, a),
                        (this.listener = a))
                      : "ws" == this.type &&
                        ((a = function (a) {
                            a = a.detail.d;
                            if (-1 < a._swAction.toLowerCase().indexOf(b.id.toLowerCase()))
                                try {
                                    var d = SwymUtils.returnJSONParsed(a._swData);
                                    b.detect(d);
                                } catch (e) {}
                        }),
                        h.evtLayer.addEventListener(h.JSEvents.wsTrap, a),
                        (this.listener = a));
              }
          };
          P.prototype.collect = function (a, b) {
              var c = this;
              setTimeout(function () {
                  c.collectImmediate(a, b);
              }, 1e3);
          };
          P.prototype.collectImmediate = function (a, b) {
              if ("email" != this.detectType || SwymUtils.validateEmail(a)) h.idCollect(a, this.id, b || "generic"), this.destroyCollectListener();
          };
          P.prototype.destroyCollectListener = function () {
              "jsonp" == this.type
                  ? this.listener.disconnect()
                  : "form" == this.type
                  ? this.target.removeEventListener("submit", this.listener)
                  : "xhrpost" == this.type || "xhrget" == this.type
                  ? h.evtLayer.removeEventListener(h.JSEvents.xhrTrap, this.listener)
                  : "ws" == this.type && h.evtLayer.removeEventListener(h.JSEvents.wsTrap, this.listener);
          };
          f.prototype.idCollect = function (a, b, c, d) {
              var e = this;
              this.swymApiPost({
                  endpoint: "/c-id",
                  params: { e: btoa(a), s: btoa(b.toLowerCase()), m: btoa(c.toLowerCase()) },
                  callbackFn: function (a, c) {
                      var f = btoa(b),
                          h = e.get(e.key.CLCTMAP);
                      h || (h = {});
                      h.hasOwnProperty(f) ? (h[f] += 1) : (h[f] = 1);
                      e.set(e.key.CLCTMAP, h);
                      d && d(a);
                  },
                  sendSessionId: !1,
                  checkRegId: !1,
                  v2: !0,
              });
          };
          v.push({
              id: "id-c",
              init: function () {
                  h = this;
                  h.retailerSettings ? ab() : h.evtLayer.addEventListener(h.JSEvents.configLoaded, ab);
              },
          });
          f.EventTypes = f.prototype.EventTypes = {
              unknownView: 0,
              productView: 1,
              categoryView: 2,
              addToCart: 3,
              addToWishlist: 4,
              addToWishList: 4,
              applyCoupon: 5,
              checkout: 6,
              dropFromCart: 7,
              watchlist: 8,
              lowStock: 9,
              sharedWishlistView: 14,
              loggedIn: 100,
              checkoutBegin: 104,
              checkoutFail: 105,
              cartTotal: 106,
              deleteEvent: -1,
          };
          f.ProductLevels = f.prototype.ProductLevels = { ProductVariant: "product-variant", ProductGroup: "product-group" };
          f.SearchFilterName = f.prototype.SearchFilterName = "relay:search";
          f.EventTypeNames = f.prototype.EventTypeNames = {};
          for (var Ua in f.EventTypes) f.EventTypeNames[f.EventTypes[Ua]] = Ua;
          f.Instrumentations = f.prototype.Instrumentations = {
              ChangeTab: 3,
              ItemClickFromRelay: 4,
              UISettings: 5,
              UIWelcome: 6,
              UIFirstAccess: 7,
              UIDisabled: 8,
              UIEnabled: 9,
              UIOpenProductDetails: 20,
              UIProductDetailsForAddToCart: 21,
              UICloseProductDetails: 22,
              UIViewProductDetails: 23,
              UIAddToCart: 24,
              UIOpenFromAnchor: 1,
              UIClose: 2,
              OpenEmailMyFaves: 25,
              EmailedMyFaves: 26,
              UICheckout: 27,
              ItemClickFromProductDetails: 28,
              UIOpenFromTooltip: 29,
              UIAddAllToCart: 30,
              DeleteItem: -1,
              NotificationShown: 11,
              UIOpenFromNotification: 12,
              DismissNotification: 13,
              ItemClickFromNotification: 14,
              RemovedFromNewsfeed: -2,
              ChangeAuthTab: 15,
              WatchlistOpened: 16,
              WatchlistDismissed: 17,
              WidgetItemOpen: 31,
              WidgetItemDetails: 32,
              WidgetAddToCart: 33,
              ShareWishlistHashCreated: 34,
              ShareWishlistViaMedium: 35,
              ConnectForShareWishlistButtonClicked: 36,
              LoginForShareButtonClicked: 37,
              SharedWishlistOpen: 38,
              ChangeHashtag: 41,
              TriggerPermissionDialogOpened: 43,
              TriggerPermissionGranted: 44,
              TriggerPermissionDenied: 45,
              TriggerPermissionDialogClosed: 46,
              OptInFormOpened: 47,
              OptInFormClosed: 48,
              OptInFormSubscribed: 49,
              PinterestConnect: 111,
              PinterestDisconnect: 112,
          };
          var rb = 1e3;
          f.prototype.instrument = function (a, b) {
              if (!SwymUtils._dontInstrument) {
                  var c = a + Math.sign(a) * rb;
                  SwymUtils.log("RAT - " + c + ", data - " + JSON.stringify(b));
                  var d = this.instrumentMap,
                      e = this.get(this.key.REGID);
                  if (e) {
                      var g = this.session.getSessionId(),
                          k = window.document.URL,
                          f = new Date().getTime();
                      b || (b = {});
                      b.ts = f;
                      d[e] || (d[e] = {});
                      d[e][g] || (d[e][g] = {});
                      d[e][g][k] || (d[e][g][k] = {});
                      d[e][g][k][c] || (d[e][g][k][c] = []);
                      d[e][g][k][c].push(b);
                      3500 < JSON.stringify(d).length ? this.dumpRI(d) : this.set(this.key.INSTRMAP, d);
                  }
              }
          };
          f.prototype.correctInstrumentation = function (a) {
              var b = this.set(this.key.INSTRMAP) || {},
                  c = {},
                  d;
              for (d in b) c[a] = b[d];
              this.set(this.key.INSTRMAP, c);
          };
          f.prototype.cleanCacheEntries = function (a) {
              var b = this.get(this.key.INSTRMAP),
                  c;
              for (c in a) {
                  var d = a[c];
                  if (b[c])
                      for (var e in d) {
                          var g = d[e];
                          if (b[c][e])
                              for (var k in g) {
                                  var f = g[k];
                                  if (b[c][e][k])
                                      for (var h in f) {
                                          var n = f[h];
                                          b[c][e][k][h] &&
                                              n.forEach(function (a) {
                                                  var d = JSON.stringify(a);
                                                  b[c][e][k][h].filter(function (a) {
                                                      return JSON.stringify(a) != d;
                                                  });
                                              });
                                      }
                              }
                      }
              }
              this.set(this.key.INSTRMAP, b);
          };
          v.push({
              id: "instr",
              init: function () {
                  this.instrumentMap = this.get(this.key.INSTRMAP) || {};
                  var a = this;
                  a.evtLayer.addEventListener(a.JSEvents.configLoaded, function () {
                      var b = a.getApp("Wishlist"),
                          c = a.getApp("Watchlist");
                      rb = b ? 1e3 : c ? 2e3 : 3e3;
                  });
              },
          });
          v.push({
              id: "authn",
              events: {},
              init: function () {
                  var a = this,
                      b = new this.FetchModel({
                          endpoint: "authn",
                          cached: !1,
                          hashFn: function (a) {
                              return "all";
                          },
                          preloadHashFn: function (a, b) {
                              return "all";
                          },
                          transformFn: function (b) {
                              var d = b.regid;
                              a.setSwymEmail(b.email);
                              if (b.clean) {
                                  for (var e in a.key) a.storage.remove(a.key[e]);
                                  a.deviceCache.putObject({});
                                  SwymUtils.log("Cleanup initiated, regid refreshing..");
                                  a.triggerSwymEvent(f.JSEvents.regidCleaned);
                              } else
                                  b.email ? ((b.authn = !0), d && (b.regid = d)) : (b.authn = !1),
                                      (d = b.regid) &&
                                          a.get(a.key.REGID) != d &&
                                          (a.set(a.key.REGID, d), SwymUtils.log("Registration id refreshing.." + d), a.productEts.makeCacheStale(), a.triggerSwymEvent(f.JSEvents.regidRefreshed, { regid: d }));
                              return b;
                          },
                          cacheStaleEvts: [],
                          internalFn: function (a, b, e) {
                              this.swat.swymApiPost({ endpoint: "/authn", v2: !0, customerRefresh: !0, callbackFn: b, errorFn: e });
                          },
                      });
                  this.exports("authn", b);
              },
          });
          f.prototype.cleanDevice = function () {
              this.authn.transformFn({ clean: !0 });
              this.clearSettingsCache();
              this.session.remove();
          };
          f.prototype.authCheck = function (a) {
              this.authn.fetch({ scb: a });
          };
          f.prototype.isAlreadyAuth = function () {
              return !!this.getSwymEmail();
          };
          Ta = "np_r";
          v.push({
              id: "filters",
              init: function () {
                  var a = new this.FetchModel({
                      name: "filters",
                      hashFn: function (a) {
                          return "all";
                      },
                  });
                  this.exports("filters", a);
                  this.exports("filtersCfg", []);
                  this.exports("_vcheckURL", "/check");
                  this.exports("_vcheckFiltersKey", "relayfilters");
                  this.filterCache = this.filters.lcache;
                  this.relayTypeFilters = {};
              },
          });
          f.prototype.getRelayFilters = function () {
              return this.relayTypeFilters;
          };
          f.prototype.setFilters = function (a, b) {
              var c = this;
              this.relayTypeFilters = this.filterCache.getObject();
              if (c.versionChecking)
                  return (
                      this.evtLayer.addEventListener(this.JSEvents.readFilters, function (b) {
                          c.relayTypeFilters = b.detail.d;
                          c.filterCache.putObject(c.relayTypeFilters);
                          a && a(c.relayTypeFilters);
                      }),
                      this.evtLayer.addEventListener(
                          this.JSEvents.readSettings,
                          SwymUtils.debounce(function (b) {
                              c.isSimpleWishlistOnly() && ((c.relayTypeFilters = c.getSimpleWishlistFilters()), c.filterCache.putObject(c.relayTypeFilters), a && a(c.relayTypeFilters));
                          }, 20)
                      ),
                      (this.filtersCfg = this.relayTypeFilters)
                  );
              setTimeout(function () {
                  a && successFn(c.relayTypeFilters || {});
              }, 10);
          };
          f.prototype.getSimpleWishlistFilters = function () {
              var a = {};
              a[this.retailerSettings.UI.Title] = this.EventTypes.addToWishlist;
              return a;
          };
          f.prototype.fetchWrtEventType = function (a, b, c) {
              this.productEts.fetchWrtEventType({ params: { medium: c ? c : "relay", et: this.relayTypeFilters[b] }, scb: a });
          };
          f.prototype.triggerNotify = function (a) {
              this.notifyJson = a;
          };
          f.prototype.wrapLogin = function (a, b) {
              b = b || { authnCheck: !0 };
              var c = this;
              (b.authnCheck
                  ? function () {
                        return c.getSwymEmail();
                    }
                  : b.storefrontCheck
                  ? function () {
                        return c.platform.isStorefrontLoggedIn();
                    }
                  : function () {
                        return !1;
                    })()
                  ? a()
                  : (b.savePath && h.storage.setSessionData(h.key.POSTLOGINRD, window.location.pathname), this.platform.redirectToLoginPage(window.location.pathname));
          };
          f.prototype.triggerNotify_ = function (a, b, c, d) {
              if (this.disableNotifications) SwymUtils.log("Skipping triggerNotify, ShowUI is disabled");
              else {
                  var e = this;
                  this.api.fetch(function (g) {
                      -1 != window.location.href.indexOf("/checkout/") ? e.ne.setPageType(2) : null != a && e.ne.setPageType(a.pageType);
                      c && (e.retailerSettings.General.ProductLevel == e.ProductLevels.ProductVariant ? ((c.vinfo = d), (c.pg = !1)) : (c.pg = !0));
                      e.ne.showNoDelayIfPossible(b, e.decorateProduct(c, "tooltip"));
                  }, "tooltip");
              }
          };
          f.prototype.setNotificationUX = function (a) {
              this.ne.setNotificationUX(a);
          };
          f.prototype.setRetailerId = function (a) {
              try {
                  (a = JSON.parse(a)), console.warn("Swym PID metafield seems to be mangled, continuing with temporary fix");
              } catch (b) {}
              this.set(this.key.PID, a);
              this.versionCheck();
              this.setFilters();
          };
          f.prototype.getSwymRegistrationId = function () {
              return this.get(this.key.REGID);
          };
          f.prototype.getSwymHostUri = function () {
              return this.swymHost;
          };
          f.prototype.trackPageview = function (a, b) {
              var c = this;
              c.currentPageData = a;
              c.trackPageview_(a, function (a) {
                  c.triggerNotify_(c.notifyJson);
                  b && b(a);
              });
          };
          f.prototype.reportPageview = function (a, b) {
              this.send(D(a, { et: this.EventTypes.productView }), b);
          };
          f.prototype.reportCheckoutTotal = function (a, b) {
              this.send(D(a, { et: this.EventTypes.cartTotal }), b);
          };
          f.prototype.reportCheckoutBegin = function (a, b) {
              this.send(D(a, { et: this.EventTypes.checkoutBegin }), b);
          };
          f.prototype.reportCheckoutFail = function (a, b) {
              this.send(D(a, { et: this.EventTypes.checkoutFail }), b);
          };
          f.prototype.trackWatchlist = function (a, b) {
              this.send(D(a, { et: this.EventTypes.watchlist }), b);
          };
          f.prototype.trackLowStock = function (a, b) {
              this.send(D(a, { et: this.EventTypes.lowStock }), b);
          };
          f.prototype.trackPageview_ = function (a, b) {
              var c = this,
                  d = this.get(this.key.INSTRMAP) || {},
                  d = bb(d);
              a = D(a, { ri: d });
              this.getSwymRegistrationId() && -1 < [f.EventTypes.unknownView, f.EventTypes.categoryView].indexOf(a.et)
                  ? setTimeout(function () {
                        b && b({});
                    }, 100)
                  : this.send(a, function (d) {
                        c.triggerSwymEvent(f.JSEvents.trackedPageView, a);
                        d.batch_report && ((c.instrumentMap = {}), c.set(c.key.INSTRMAP, {}));
                        b && b(d);
                    });
          };
          f.prototype.dumpRI = function (a, b) {
              var c = this,
                  d = a || this.get(this.key.INSTRMAP) || {};
              this.instrumentMap = {};
              var e = bb(d),
                  e = D({}, { et: f.EventTypes.unknownView, ri: e });
              this.send(e, function (a) {
                  a.batch_report && c.cleanCacheEntries(d);
                  b && b(a);
              });
          };
          f.prototype.addToCart = function (a, b) {
              this.send(D(a, { et: this.EventTypes.addToCart, qty: 1 }), b);
          };
          f.prototype.reportAddToCart = f.prototype.addToCart;
          f.prototype.reportPurchase = function (a, b) {
              this.send(D(a, { et: this.EventTypes.checkout, qty: 1 }), b);
          };
          f.prototype.dropFromCart = function (a, b) {
              this.send(D(a, { et: this.EventTypes.dropFromCart, qty: 1 }), b);
          };
          f.prototype.addToWishList = function (a, b, c, d, e) {
              var g = this;
              ["epi", "empi"].forEach(function (b) {
                  if (!a[b]) throw Error("Add to Wishlist call should have epi & empi");
              });
              if (a.du && !SwymUtils.validateUrl(a.du)) throw Error("du should be an absolute URL");
              e && e.edit
                  ? this.ui.openHashtagEditor(
                        a,
                        { evtElem: e.evt.currentTarget, evt: e.evt },
                        function (a) {
                            g.isInWishlist(a, function (f) {
                                f ? g.productEts.updateProductHashtags(a.epi, a.hashtags, b, e.fcb) : g.api.addToWishList(a, b, c, d);
                            });
                        },
                        function () {
                            e.fcb && e.fcb.apply(this, arguments);
                        }
                    )
                  : (this.scheduleUserPreferenceAsk(),
                    this.send(D(a, { et: this.EventTypes.addToWishlist }), function (e) {
                        e = e.event ? e.event : a;
                        g.exemptDevice();
                        c || g.triggerNotify_({ pageType: 1, noDelay: !0 }, ha(u.NTs[u.NTNames.addedToWishlist]), ha(e), d);
                        g.triggerSwymEvent(f.JSEvents.addedToWishlist, e);
                        b(a);
                    }));
          };
          f.prototype.isInWishlist = function (a, b) {
              var c = this;
              this.api.fetchWrtEventTypeET(function (d) {
                  b(!!c.productEts.quickFindIdxForEpiEt(a.epi, c.EventTypes.addToWishlist));
              }, this.EventTypes.addToWishlist);
          };
          f.prototype.removeFromWishList = function (a, b) {
              var c = this;
              a.et = this.EventTypes.addToWishlist;
              a.type = this.retailerSettings.General.ProductLevel;
              this.api.deleteEvent(
                  function () {
                      c.triggerSwymEvent(f.JSEvents.removedFromWishlist, a);
                      b(a);
                  },
                  null,
                  a
              );
          };
          f.prototype.addToWatchList = function (a, b, c, d) {
              var e = ha(b);
              ["epi", "empi", "iu"].forEach(function (a) {
                  if (!e[a]) throw Error("Page data should have du, epi, empi, iu");
              });
              ["pr"].forEach(function (a) {
                  if (SwymUtils.isUndefined(e[a]) || null == e[a]) throw Error("Page data should have valid pr");
              });
              if (e.du && !SwymUtils.validateUrl(e.du)) throw Error("du should be an absolute URL");
              this.ui.openRemindMe(a, this.decorateProduct(e, "watchlist"), c, d);
          };
          f.prototype.sendWatchlistV3 = function (a, b, c, d, e) {
              if ("object" === typeof a) {
                  for (var g = !1, f = 0, m = a.length; f < m; f++) {
                      var p = a[f].medium,
                          n = a[f].mediumvalue;
                      "email" !== p || SwymUtils.validateEmail(n) ? "sms" !== p || SwymUtils.validatePhoneNumber(n) || (g = !0) : (g = !0);
                  }
                  if (g) {
                      SwymUtils.error("Invalid medium value for one of the inputs");
                      return;
                  }
              }
              g = (window._swat.retailerSettings.Watchlist.Topics || []).join(",");
              a = { event: ga(D(b, { et: this.EventTypes.watchlist })), topics: g ? g : "backinstock", mediums: a };
              h.retailerSettings.Watchlist.MailingListCheckInPopup && (a.addtomailinglist = e);
              e = !1;
              a.event.epi && a.event.empi && !a.event.iu && !a.event.pr && (e = !0);
              this.swymApiPost({ endpoint: e ? "/epiAddToWatchlist" : "/addToWatchlist", params: a, callbackFn: c, v3: !0, errorFn: d });
          };
          f.prototype.sendWatchlist = function (a, b, c, d, e, g, k) {
              if (SwymUtils.validateEmail(a)) {
                  if (!c.epi || !c.empi) throw Error("Add to Watchlist call should have epi & empi");
                  k = window._swat;
                  var m = (k.retailerSettings.Watchlist.Topics || []).join(",");
                  if (c.cprops && "object" !== typeof c.cprops) throw Error("cprops should be an object");
                  a = { event: ga(D(c, { et: this.EventTypes.watchlist })), mediumvalue: a, medium: b, topics: m ? m : "backinstock" };
                  try {
                      null !== c.variants && "object" === typeof c.variants && (c.variants = JSON.stringify(c.variants));
                  } catch (p) {
                      SwymUtils.error("Error in stringifying variants key - " + p);
                  }
                  h.retailerSettings.Watchlist.MailingListCheckInPopup && (a.addtomailinglist = g);
                  k.triggerSwymEvent(f.JSEvents.addedToWatchlist, a.event);
                  k.sendWatchlistInternal(a, d, e);
              } else SwymUtils.error("Invalid email address");
          };
          f.prototype.subscribeForProductAlert = function (a, b, c, d, e, g, k) {
              var m;
              m = { email: SwymUtils.validateEmail, sms: SwymUtils.validatePhoneNumber };
              m = 0 > Object.keys(m).indexOf(b) ? !1 : m[b](a) ? !0 : !1;
              if (m)
                  if (c.epi && c.empi)
                      if (c.cprops && "object" !== typeof c.cprops) SwymUtils.error("cprops should be an object");
                      else {
                          a = { event: ga(D(c, { et: this.EventTypes.watchlist })), mediumvalue: a, medium: b, topics: k || "backinstock" };
                          try {
                              null !== c.variants && "object" === typeof c.variants && (c.variants = JSON.stringify(c.variants));
                          } catch (h) {
                              SwymUtils.error("Error in stringifying variants key - " + h);
                          }
                          g && !this.retailerSettings.Watchlist.MailingListCheckInPopup
                              ? SwymUtils.error("Enable Mailing list check from dashboard")
                              : (this.retailerSettings.Watchlist.MailingListCheckInPopup && (a.addtomailinglist = g), this.triggerSwymEvent(f.JSEvents.addedToWatchlist, a.event), this.sendWatchlistInternal(a, d, e));
                      }
                  else SwymUtils.error("Product object must have epi & empi");
              else SwymUtils.error("Invalid medium and/or mediumInfo value");
          };
          f.prototype.sendWatchlistInternal = function (a, b, c) {
              var d = !1;
              a.event.epi && a.event.empi && !a.event.iu && !a.event.pr && (d = !0);
              this.swymApiPost({ endpoint: d ? "/epiAddToWatchlist" : "/addToWatchlist", params: a, callbackFn: b, v2: !0, errorFn: c });
          };
          f.prototype.addToCoupon = function (a, b, c) {
              this.send(D(a, { et: this.EventTypes.applyCoupon }), b);
          };
          f.prototype.fetch = function (a, b) {
              this.productEts.fetchWrtEventType({ params: { medium: b ? b : "relay" }, scb: a });
          };
          f.prototype.count = function (a, b, c, d, e, g) {
              this.countInternal(a, b, c, d, e, g);
          };
          f.prototype.countEvents = function (a, b) {
              this.productEts.fetchWrtEventType({
                  params: { et: a, medium: "relay" },
                  scb: function (a) {
                      b(a.length);
                  },
              });
          };
          f.prototype.fetchWrtEventTypeET = function (a, b, c) {
              this.productEts.fetchWrtEventType({ params: { medium: c ? c : "relay", et: b }, scb: a });
          };
          f.prototype.wishlistCount = function (a) {
              this.countEvents(this.EventTypes.addToWishlist, a);
          };
          f.prototype.renderWishlistCount = function (a, b, c) {
              var d = 0,
                  e,
                  g = this,
                  k = function (c) {
                      0 < c
                          ? (SwymUtils.addClass(a, "show-badge"),
                            SwymUtils.addClass(a, "update-badge"),
                            clearTimeout(e),
                            (e = setTimeout(function () {
                                SwymUtils.removeClass(a, "update-badge");
                            }, 2e3)))
                          : SwymUtils.removeClass(a, "show-badge");
                      a.setAttribute("data-count", c);
                      d = a.innerHTML = c;
                      b && b(c, a);
                  };
              this.wishlistCount(k);
              if (c)
                  var m = k,
                      h,
                      k = function (a) {
                          d = a;
                          clearTimeout(h);
                          h = setTimeout(function () {
                              m(a);
                          }, c);
                      };
              this.evtLayer.addEventListener(this.JSEvents.addedToWishlist, function () {
                  k(d + 1);
              });
              this.evtLayer.addEventListener(this.JSEvents.deletedFromRelay, function (a) {
                  a.detail.d.currEt == g.EventTypes.addToWishList && k(Math.max(d - 1, 0));
              });
              this.evtLayer.addEventListener(this.JSEvents.regidRefreshed, function (a) {
                  g.wishlistCount(k);
              });
              this.evtLayer.addEventListener(f.JSEvents.productInvalidOnLoad, function (a) {
                  a.detail.d.product.et == g.EventTypes.addToWishList && k(Math.max(d - 1, 0));
              });
          };
          f.prototype.exemptDevice = function (a) {};
          f.prototype.isDefaultBucket = function (a) {
              return !0;
          };
          f.prototype.getUserInfo = function (a) {
              this.api.authCheck(function (b) {
                  a(b.email);
              });
          };
          f.prototype.logoutCleanUp = function () {
              this.retailerSettings.General.LogoutClean && this.isAlreadyAuth() && (this.cleanDevice(), this.storage.remove("ol_ct"), this.refresh(SwymUtils.EmptyFunction));
          };
          f.prototype.remoteAuthRequest = function (a, b, c) {
              this.remoteAuthRequestInternal(c, a, b);
          };
          f.prototype.sendEmailWishList = function (a, b, c, d, e, g) {
              this.sendEmailWishListInternal(b, c, d, e, a, g);
          };
          f.prototype.removeUserFromDevice = function (a, b) {
              var c = this;
              this.removeUserFromDeviceInternal(function (b) {
                  a(b);
                  c.set(c.key.REMOTEAUTH, 0);
              }, b);
          };
          f.prototype.getProducts = function (a, b, c) {};
          f.prototype.deleteEvent = function (a, b, c) {
              var d = this,
                  e = !1;
              c
                  ? ((c = ha(c)),
                    c.et == d.EventTypes.addToWishlist && (e = !0),
                    (c.currEt = c.et),
                    (c.et = d.EventTypes.deleteEvent),
                    ["op", "pr"].forEach(function (a) {
                        c[a] && -1 != c[a].toString().indexOf("$ ") && (c[a] = parseFloat(c[a].split("$ ")[1]));
                    }),
                    (c = d.cleanEventMap(c)),
                    d.triggerSwymEvent(f.JSEvents.deletedFromRelay, c),
                    d.send(D(c, { qty: 1 }), a),
                    e && (c.type = window._swat.retailerSettings.General.ProductLevel))
                  : ((c = {}),
                    this.api.fetch(function () {
                        (c = d.productEts.quickFindEvent({ _id: b })) ? d.api.deleteEvent(a, b, c) : a(null);
                    }));
          };
          f.prototype.cleanEventMap = function (a) {
              var b = {};
              "et du epi empi ct iu dt pr pt variants currEt".split(" ").forEach(function (c) {
                  SwymUtils.isUndefined(a[c]) || (b[c] = a[c]);
              });
              return b;
          };
          f.prototype.updateEvent = function (a, b, c, d) {
              this.swymApiPost({ endpoint: "/updateEvent", params: { eventId: a, pageMap: this.cleanEventMap(b) }, callbackFn: c, errorFn: d });
          };
          f.prototype.deleteAllEvents = function (a) {
              a();
          };
          f.prototype.getFilters = function () {
              return this.filtersCfg;
          };
          f.prototype.refreshViaProvider = function () {
              this.api.authCheck();
          };
          f.prototype.enableUINotifications = function () {
              this.disableNotifications = !1;
          };
          f.prototype.disableUINotifications = function () {
              this.disableNotifications = !0;
          };
          f.prototype.initSwymWidgets = function (a, b) {
              var c = window._swat,
                  d,
                  e = c.retailerSettings;
              b || (b = SwymUtils.getPageURLAsLocation().href);
              e ? e.Wishlist.EnableFaveCount && (d = document.querySelector(e.Wishlist.FaveCountSelector)) : (d = document.getElementById("swym-fave-count"));
              d &&
                  (c.evtLayer.addEventListener(f.JSEvents.addedToWishlist, function () {
                      c.populateFaveButton(d, b, e.General.ProductLevel, a);
                      c.incFaveButton(d);
                  }),
                  c.evtLayer.addEventListener(f.JSEvents.removedFromWishlist, function () {}),
                  c.evtLayer.addEventListener(c.JSEvents.variantChanged, function (g) {
                      g = g.detail.d.variant;
                      a = g.id;
                      c.populateFaveButton(d, b, e.General.ProductLevel, g.id);
                  }),
                  c.populateFaveButton(d, b, e.General.ProductLevel, a));
          };
          f.prototype.populateFaveButton = function (a, b, c, d) {
              this.count(
                  f.EventTypes.addToWishlist,
                  function (b) {
                      SwymUtils.onDOMReady(function () {
                          a.setAttribute("data-count", b.count);
                          a.innerHTML = SwymUtils.abbrNum(b.count);
                      });
                  },
                  SwymUtils.EmptyFunction,
                  b,
                  c,
                  d
              );
          };
          f.prototype.incFaveButton = function (a) {
              if (a) {
                  var b = parseInt(a.getAttribute("data-count") || 0, 10);
                  a.setAttribute("data-count", b + 1);
                  a.innerHTML = SwymUtils.abbrNum(b + 1);
              }
          };
          f.prototype.decFaveButton = function (a) {
              if (a) {
                  var b = parseInt(a.getAttribute("data-count") || 0, 10);
                  a.setAttribute("data-count", b - 1);
                  a.innerHTML = SwymUtils.abbrNum(b - 1);
              }
          };
          f.prototype.reportTierMismatch = function (a, b) {
              this.swymApiPost({
                  endpoint: "/report-tier-mismatch",
                  params: {},
                  callbackFn: function () {
                      a();
                  },
                  v3: !0,
                  errorFn: function (a) {
                      b(a);
                  },
                  sendSessionId: !1,
                  sendRegId: !1,
              });
          };
          f.prototype.updateUserEmailPreference = function (a, b, c, d, e) {
              if ((!0 !== b && !1 !== b) || !a) throw Error("Email preference has to be a boolean");
              this.isAlreadyAuth() || this.idCollect(a, "swym", "triggerpermission");
              b = { SendEmail: { enabled: b, source: "client" } };
              this.retailerSettings.General.MailingListCheck && c && (b.AddToMailingList = { enabled: c, appname: "Wishlist" });
              this.api.updateUserPreferences(a, b, d, e);
          };
          f.prototype.getUserPreferences = function (a, b, c, d) {
              var e = this,
                  g = this.getSwymUserPref();
              g
                  ? c(g)
                  : this.swymApi({
                        endpoint: "/user-preference",
                        params: { prefkeys: b, userid: a },
                        callbackFn: function (a) {
                            a.clusterid && (e.setSwymUserPref(a), c(a));
                        },
                        v2: !0,
                        errorFn: d,
                        sendSessionId: !1,
                        waitForRegister: !1,
                        checkRegId: !1,
                    });
          };
          f.prototype.mediumValidate = function (a, b, c, d, e, g) {
              this.swymApiPost({ endpoint: "/user/mediums/validate", params: { context: { topics: a, event: ga(D(b, { et: this.EventTypes.watchlist })) }, medium: c, mediumvalue: d }, v3: !0, noProvider: !0, callbackFn: e, errorFn: g });
          };
          f.prototype.sendOTP = function (a, b) {
              this.swymApiPost({ endpoint: "/send-otp", params: { mediumvalue: a, medium: "sms", regid: window._swat.storage.get("swymRegid") }, callbackFn: b, v3: !0, sendSessionId: !1 });
          };
          f.prototype.validateOTP = function (a, b, c) {
              var d = window._swat;
              d.swymApiPost({ endpoint: "/validate-otp", params: { otpcode: a, mediumvalue: b, medium: "sms", regid: d.storage.get("swymRegid") }, callbackFn: c, v3: !0, sendSessionId: !1 });
          };
          f.prototype.postUserSubscriptions = function (a) {
              this.swymApiPost({
                  endpoint: "/user/subscriptions",
                  params: a,
                  callbackFn: function () {},
                  v3: !0,
                  errorFn: function (a) {
                      SwymUtils.error("Could not subscribe:", a);
                  },
                  sendSessionId: !1,
                  waitForRegister: !1,
                  checkRegId: !1,
                  avoidPid: !0,
              });
          };
          f.prototype.postUserPreference = function (a, b) {
              this.swymApiPost({
                  endpoint: "/user-preference",
                  params: { email: a || null, prefmap: b },
                  callbackFn: function () {},
                  v3: !0,
                  errorFn: function (a) {
                      SwymUtils.error("Could not subscribe:", a);
                  },
                  sendSessionId: !1,
                  waitForRegister: !1,
                  checkRegId: !1,
              });
          };
          f.prototype.deleteUserSubscriptions = function (a) {
              this.swymApiDelete({
                  endpoint: "/user/subscriptions",
                  params: a,
                  callbackFn: function () {},
                  v3: !0,
                  errorFn: function (a) {
                      SwymUtils.error("Could not subscribe:", a);
                  },
                  sendSessionId: !1,
                  waitForRegister: !1,
                  checkRegId: !1,
                  avoidPid: !0,
              });
          };
          f.prototype.updateUserPreferences = function (a, b, c, d) {
              var e = this;
              if (a)
                  this.swymApiPost({
                      endpoint: "/user-preference",
                      params: { prefmap: b, userid: a },
                      callbackFn: function (a) {
                          e.setSwymUserPref(b);
                          c(a);
                      },
                      v2: !0,
                      errorFn: d,
                      sendSessionId: !1,
                      checkRegId: !1,
                      waitForRegister: !1,
                  });
              else throw Error("Preferences currently saved only for users who have authorized.");
          };
          f.prototype.scheduleUserPreferenceAsk = function () {
              var a = this,
                  b = h.retailerSettings.Wishlist.WishlistReminderPopup,
                  c = h.storage.get("uprefask");
              if (b) {
                  if (c) {
                      var d = function () {
                          SwymUtils.deferredCallback(function () {
                              a.ui.openGetTriggerPermissionDialog(function () {
                                  a.storage.remove("uprefask");
                              });
                          }, 5e3);
                      };
                      h.isSwymAuthn()
                          ? this.getCheckUserPreferenceMeta(function (c) {
                                c = c.CheckUserPreference ? c.CheckUserPreference : !1;
                                !0 === c || void 0 === c
                                    ? ((c = a.getSwymEmail() || a.storage.get(h.key.WEML)),
                                      a.getUserPreferences(
                                          c,
                                          ["SendEmail", "AddToMailingList"],
                                          function (c) {
                                              (c && !c.hasOwnProperty("SendEmail")) || (c && c.SendEmail && !c.SendEmail.enabled && b.CheckConditions.ShowTillAccept)
                                                  ? c.clusterid && (d(), h.storage.set("gdprShownTs", +new Date()))
                                                  : a.storage.remove("uprefask");
                                          },
                                          function (a) {}
                                      ))
                                    : a.storage.remove("uprefask");
                            })
                          : b.ShowEmailCapture &&
                            a.getUserPreferences("", ["SendEmail", "AddToMailingList"], function (a) {
                                a.clusterid && (d(), h.storage.set("gdprShownTs", +new Date()));
                            });
                  }
              } else {
                  var e = function () {
                          var b = a.storage.get(a.key.TPERMTS);
                          (!b || (b && b <= Date.now())) &&
                              SwymUtils.deferredCallback(function () {
                                  a.ui.openGetTriggerPermissionDialog(function () {
                                      a.storage.remove("uprefask");
                                  });
                              }, 5e3);
                      },
                      a = this;
                  this.storage.set("uprefask", !0);
                  this.getCheckUserPreferenceMeta(function (b) {
                      var c = b.CheckUserPreference ? b.CheckUserPreference : !1;
                      b = b.TriggerRules && b.TriggerRules.Wishlist ? b.TriggerRules.Wishlist : !1;
                      !0 === c || void 0 === c
                          ? !0 === b
                              ? ((c = a.getSwymEmail() || a.storage.get(h.key.WEML)),
                                a.getUserPreferences(
                                    c,
                                    ["SendEmail", "AddToMailingList"],
                                    function (b) {
                                        b && !b.hasOwnProperty("SendEmail") ? b.clusterid && e() : a.storage.remove("uprefask");
                                    },
                                    function (a) {}
                                ))
                              : a.storage.remove("uprefask")
                          : a.storage.remove("uprefask");
                  });
              }
          };
          f.prototype.updateWishlistEvent = SwymUtils.debounce(function (a, b, c) {
              var d = window._swat;
              a = a.map(function (a) {
                  var b = {};
                  ["epi", "cprops"].forEach(function (c) {
                      SwymUtils.isUndefined(a[c]) || (b[c] = a[c]);
                  });
                  return b;
              });
              d.swymApiPost({
                  endpoint: "/updateProductWishlistEvent",
                  params: { "epi-data": JSON.stringify(a) },
                  callbackFn: function (a, c) {
                      d.productEts.makeCacheStale();
                      b(a);
                  },
                  errorFn: c,
                  checkRegId: !0,
                  sendSessionId: !1,
                  v2: !0,
              });
          }, 1e3);
          f.prototype.unsubscribeFromSwym = function (a, b, c) {
              h.swymApiPost({ endpoint: "/unsubscribeFromSwym", params: a, callbackFn: b, errorFn: c, v2: !0 });
          };
          f.prototype.triggerNotify = f.prototype.triggerNotify;
          f.prototype.setNotificationUX = f.prototype.setNotificationUX;
          f.prototype.setRetailerId = f.prototype.setRetailerId;
          f.prototype.getSwymRegistrationId = f.prototype.getSwymRegistrationId;
          f.prototype.getSwymHostUri = f.prototype.getSwymHostUri;
          f.prototype.trackPageview = f.prototype.trackPageview;
          f.prototype.addToCart = f.prototype.addToCart;
          f.prototype.reportPurchase = f.prototype.reportPurchase;
          f.prototype.dropFromCart = f.prototype.dropFromCart;
          f.prototype.addToWishList = f.prototype.addToWishList;
          f.prototype.addToCoupon = f.prototype.addToCoupon;
          f.prototype.fetch = f.prototype.fetch;
          f.prototype.count = f.prototype.count;
          f.prototype.fetchWrtEventType = f.prototype.fetchWrtEventType;
          f.prototype.authCheck = f.prototype.authCheck;
          f.prototype.remoteAuthRequest = f.prototype.remoteAuthRequest;
          f.prototype.sendEmailWishList = f.prototype.sendEmailWishList;
          f.prototype.removeUserFromDevice = f.prototype.removeUserFromDevice;
          f.prototype.deleteEvent = f.prototype.deleteEvent;
          f.prototype.deleteAllEvents = f.prototype.deleteAllEvents;
          f.prototype.refreshViaProvider = f.prototype.refreshViaProvider;
          f.prototype.enableUINotifications = f.prototype.enableUINotifications;
          f.prototype.disableUINotifications = f.prototype.disableUINotifications;
          f.prototype.renderWishlistCount = f.prototype.renderWishlistCount;
          f.prototype.wishlistCount = f.prototype.wishlistCount;
          f.prototype.countEvents = f.prototype.countEvents;
          v.push({
              id: "fetch",
              events: { fetchProducts: "sw:fetchproducts" },
              init: function () {
                  function a(a) {
                      var b = {},
                          c = [];
                      a.forEach(function (a, d) {
                          if (b[a.epi])
                              if (-1 < g.indexOf(a.et))
                                  c = c.filter(function (b) {
                                      return b.epi != a.epi;
                                  });
                              else return;
                          c.push(a);
                          b[a.epi] = a;
                      });
                      return c;
                  }
                  function b(b) {
                      var c = b.epis,
                          d = b.metadata;
                      c &&
                          d &&
                          (b = c.map(function (a) {
                              var b = e.findProduct(a.epi, !0);
                              return Object.assign({}, a, b);
                          }));
                      return a(b);
                  }
                  function c() {
                      e.productEts.preLoadTransformFn = b;
                      e.productEts.transformFn = b;
                  }
                  var d = new this.FetchModel({
                          name: "products",
                          hashFn: function (a) {
                              return "all";
                          },
                          preloadHashFn: function (a, b) {
                              return "all";
                          },
                          cacheStaleEvts: [this.JSEvents.removedFromWishlist, this.JSEvents.deletedFromRelay].concat(this.FetchModel.defaultOpts.cacheStaleEvts),
                          defaultParams: { days: 30 },
                          gSEvtNames: [this.JSEvents.fetchProducts],
                          transformFn: a,
                          preLoadTransformFn: a,
                          internalFn: function (a, b, d) {
                              function e() {
                                  var f = g.swat.isSimpleWishlistOnly();
                                  if (g.swat.isNonFetchUI())
                                      setTimeout(function () {
                                          b([]);
                                      });
                                  else {
                                      var h = g.swat.get(g.swat.key.SVD),
                                          n = g.swat,
                                          K = null === h || 1 == h || g.swat.isAlreadyAuth(),
                                          h = a.params,
                                          h = { days: h.days, q: h.query };
                                      n.retailerSettings.General.UseProductMetadataStore &&
                                          ((h["cached-products"] = n.getCachedProducts()), f ? delete h.days : ((h["include-saved"] = K), (f = n.getApp("ShoppingAssistant")) && f.enabled && (h["include-backfill"] = !0)));
                                      f = "/" + n.getFetchEndpointFn();
                                      g.swat.swymApiPost({
                                          endpoint: f,
                                          v2: !0,
                                          params: h,
                                          callbackFn: function (a) {
                                              if (n.retailerSettings.General.UseProductMetadataStore) {
                                                  n.upsertProductsToCache(a.metadata);
                                                  var d = n.getApp("ShoppingAssistant");
                                                  0 < a.epis.length && d && n.resetBackfillProductsCache ? n.resetBackfillProductsCache() : a.backfill && n.upsertBackfillProductsToCache && n.upsertBackfillProductsToCache(a.backfill || []);
                                                  n.productEts.reassignPreloadHashFn || ((n.productEts.reassignPreloadHashFn = !0), c());
                                              }
                                              b(a);
                                          },
                                          errorFn: d,
                                      });
                                  }
                              }
                              var g = this;
                              g.swat.retailerSettings
                                  ? e()
                                  : g.evtLayer.addEventListener(g.swat.JSEvents.configLoaded, function () {
                                        e();
                                    });
                          },
                      }),
                      e = this,
                      g = [e.EventTypes.addToCart, e.EventTypes.checkout];
                  d.fetchWrtEventType = function (a) {
                      var b = a.scb;
                      a.scb = function (c, d) {
                          var e = c,
                              e = this.filterEvents(c, a.params.et);
                          e.forEach(function (b) {
                              b.du = this.swat.tagURL(b.du, a.params.medium);
                          }, this);
                          b.apply(this, [e, a]);
                      };
                      a.scb = a.scb.bind(this);
                      this.fetch(a);
                  };
                  d.quickFindForEpi = function (a) {
                      for (var b = this.mcache.all, c = b.length, d, e = 0; e < c; e++) {
                          var g = b[e];
                          if (g.epi == a) {
                              d = g;
                              break;
                          }
                      }
                      return d;
                  };
                  d.quickFindIdxForEpiEt = function (a, b) {
                      for (var c = this.mcache.all, d = c.length, e, g = 0; g < d; g++) {
                          var f = c[g];
                          if (f.epi == a && f.et == b) {
                              e = { evt: f, idx: g };
                              break;
                          }
                      }
                      return e;
                  };
                  d.quickFindForDu = function (a) {
                      for (var b = this.mcache.all, c = b.length, d, e = 0; e < c; e++) {
                          var g = b[e];
                          if (g["raw-du"] == a) {
                              d = g;
                              break;
                          }
                      }
                      return d;
                  };
                  d.quickFindEvent = function (a) {
                      for (var b = this.mcache.all, c = b.length, d, e = 0; e < c; e++) {
                          var g = b[e],
                              f = !0,
                              h;
                          for (h in a) f = a[h] == g[h];
                          if (f) {
                              d = g;
                              break;
                          }
                      }
                      return d;
                  };
                  d.filterEvents = function (a, b) {
                      return SwymUtils.isUndefined(b)
                          ? a
                          : a.filter(function (a) {
                                return b == a.et;
                            });
                  };
                  d.updateEvent = function (a, b) {
                      if (this.mcache && this.mcache.all) {
                          var c = this.quickFindIdxForEpiEt(a.epi, a.et);
                          if (c) {
                              if (b) this.mcache.all.splice(c.idx, 1);
                              else {
                                  var d = JSON.parse(JSON.stringify(a));
                                  this.mcache.all.splice(c.idx, 1, d);
                              }
                              this.lcache.updateObject(this.mcache);
                              this.updateCacheTsBy(2);
                          }
                      }
                  };
                  d.updateCacheTsBy = SwymUtils.debounce(function (a) {
                      d.lcache.updateCacheTsBy(a);
                  }, 1e3);
                  d.reassignPreloadHashFn = !1;
                  this.exports("productEts", d);
                  e = this;
                  this.isSimpleWishlistOnly() ||
                      this.evtLayer.addEventListener(
                          this.JSEvents.fetchProducts,
                          SwymUtils.debounce(function (a) {
                              a = a.detail.d;
                              e.get(e.key.SVD) && e.storage.setSessionData(e.key.SVD, -1);
                              0 < e.productEts.filterEvents(a, e.EventTypes.addToWishList).length && e.storage.setSessionData(e.key.SVD, 1);
                          }, 10)
                      );
                  this.productEts.updateCache = function (a) {
                      if (this.mcache && this.mcache.all) {
                          this.mcache = this.lcache.getObject();
                          if (this.quickFindForEpi(a.epi)) this.makeCacheStale();
                          else {
                              var b = JSON.parse(JSON.stringify(a));
                              b.ts = Date.now();
                              b.et = a.et;
                              b._id = "temp_" + b.ts;
                              b["raw-du"] = b.du;
                              this.mcache.all.unshift(b);
                              this.lcache.updateObject(this.mcache);
                          }
                          this.swat.triggerSwymEvent(this.swat.JSEvents.productsCacheUpdated, this.mcache);
                      }
                  };
                  this.productEts.checkAndClearCache = function (a) {
                      this.lcache.updateCacheTsBy(a || -60);
                  };
                  this.productCache = this.productEts.lcache;
                  this.evtLayer.addEventListener(this.JSEvents.configLoaded, function () {
                      function a(b) {
                          e.productEts.updateCache(b.detail.d);
                          e.productEts.checkAndClearCache();
                      }
                      e.isSimpleWishlistOnly()
                          ? e.evtLayer.addEventListener(e.JSEvents.addedToWishlist, a)
                          : (e.evtLayer.addEventListener(e.JSEvents.addedToWishlist, function () {
                                e.productEts.makeCacheStale();
                            }),
                            e.evtLayer.addEventListener(e.JSEvents.newProductTracked, a));
                      e.retailerSettings.General.UseProductMetadataStore && ((e.productEts.reassignPreloadHashFn = !0), c());
                  });
                  e.productEts.reassignFnForMetadataStore = c;
              },
          });
          f.prototype.tagURL = function (a, b) {
              a = a.replace("utm_source=swym", "").replace("utm_medium=tooltip", "").replace("utm_medium=relay", "");
              0 == (a.split("?")[1] || "").length && (a = a.replace("?", ""));
              return a;
          };
          f.prototype.tagURLWithHash = function (a, b) {
              var c = SwymUtils.getURLAsLocation(a);
              c.search = c.search.replace("utm_source=swym", "").replace("utm_medium=tooltip", "").replace("utm_medium=relay", "");
              c.hash += "-swym-" + b;
              return c.href;
          };
          f.prototype.tagURLWithUTM = function (a, b) {
              return (a += (-1 == a.indexOf("?") ? "?" : "&") + (-1 == a.indexOf("utm_source=swym") ? "utm_source=swym&" : "") + "utm_medium=" + b);
          };
          f.prototype.decorateProduct = function (a, b) {
              a && a.du && (a.du = this.tagURL(a.du, b));
              return a;
          };
          f.prototype.getFetchEndpointFn = function () {
              var a = this.isSimpleWishlistOnly(),
                  b = this.get(this.key.SVD),
                  b = null === b || 1 == b || this.isAlreadyAuth(),
                  b = a ? "fetchWishlist" : b ? "fetchIncludeSaved" : "fetch";
              this.retailerSettings.General.UseProductMetadataStore && (b = a ? "fetchWishlistwithMetadata" : "fetchWithMetadata");
              this.retailerSettings.General.UseFetchWithML && (this.isDefaultBucket() || (b += "ML"));
              return b;
          };
          v.push({
              id: "devices",
              events: { fetchDevices: "sw:fetchdevices" },
              init: function () {
                  var a = new this.FetchModel({
                      name: "devices",
                      hashFn: function (a) {
                          return "all";
                      },
                      preloadHashFn: function (a, c) {
                          return "all";
                      },
                      gSEvtNames: [this.JSEvents.fetchDevices],
                      internalFn: function (a, c, d) {
                          this.swat.swymApiPost({ endpoint: "/devices", v2: !0, callbackFn: c, errorFn: d });
                      },
                  });
                  this.exports("currDevice", a);
                  this.deviceCache = this.currDevice.lcache;
              },
          });
          f.prototype.devices = function (a) {
              this.currDevice.fetch({ scb: a });
          };
          v.push({
              id: "uprefcheckmeta",
              events: { fetchUserPrefCheckMeta: "sw:fetchuserprefcheckmeta" },
              init: function () {
                  var a = new this.FetchModel({
                      name: "uprefcheckmeta",
                      hashFn: function (a) {
                          return "all";
                      },
                      preloadHashFn: function (a, c) {
                          return "all";
                      },
                      gSEvtNames: [this.JSEvents.fetchUserPrefCheckMeta],
                      internalFn: function (a, c, d) {
                          this.swat.swymApi({ endpoint: "/user-pref-check-flags", params: {}, callbackFn: c, v2: !0, errorFn: d, sendSessionId: !1, sendRegId: !1, waitForRegister: !1, checkRegId: !1 });
                      },
                  });
                  this.exports("uprefCheckMeta", a);
              },
          });
          f.prototype.getCheckUserPreferenceMeta = function (a) {
              this.uprefCheckMeta.fetch({ scb: a });
          };
          v.push({
              id: "productsstore",
              events: { productsStoreUpdated: "sw:productsstoreupdated" },
              init: function () {
                  function a(a, b, c, d) {
                      var e = JSON.parse(JSON.stringify(a)),
                          e = SwymUtils.extendDefaults(e, b),
                          f = !!e.iu;
                      a = a.inactive || !f;
                      d && h.productEts.updateEvent(e, a);
                      c(e, a, b);
                  }
                  var b = this;
                  b.productMetadataCache = new R("productsstore", 86400, b.storage);
                  var c = b.productMetadataCache.getObject() || [];
                  f.prototype.getProductMetadata = SwymUtils.debounce(function (a, c, d) {
                      b.swymApiPost({
                          endpoint: "/getProductMetadata",
                          v2: !0,
                          params: { products: a },
                          callbackFn: function (a) {
                              b.upsertProductsToCache(a);
                              c(a, { found: [], inactive: [] });
                          },
                          errorFn: d,
                      });
                  }, 500);
                  b.transformProductMetadata = function (a) {
                      var c = {},
                          d = SwymUtils.deepcopy(a);
                      d.dt = d.title;
                      d.ct = d.prodtype;
                      d.du = d["raw-du"] = b.platform.getDuFromVariantUri(d.uri);
                      c[b.platform.getVariantString(d)] = d.epi;
                      d.variants = JSON.stringify([c]);
                      "title prodtype vkey1 vkey2 vkey3 vval1 vval2 vval3 vendor iqty id uri".split(" ").forEach(function (a) {
                          delete d[a];
                      });
                      return d;
                  };
                  b.getCachedProducts = function () {
                      var a = [];
                      b.productMetadataCache.isCacheEntryStale() ||
                          (a = c.map(function (a) {
                              return { _hv: a._hv, epi: a.epi };
                          }));
                      return a;
                  };
                  b.findProduct = function (a, d) {
                      if (b.productMetadataCache.isCacheEntryStale()) return {};
                      for (var e, f = c.length - 1; 0 <= f; f--)
                          if (c[f].epi === a) {
                              e = c[f];
                              break;
                          }
                      return (e = e ? (d ? b.transformProductMetadata(e) : e) : {});
                  };
                  b.getUpdatedProductsMetaData = function (a, b) {
                      for (var c = !1, d, e = a.length - 1; 0 <= e; e--)
                          if (((d = a[e]), d.epi === b.epi)) {
                              c = !0;
                              d._hv !== b._hv && (a[e] = b);
                              break;
                          }
                      c || a.push(b);
                      return a;
                  };
                  b.upsertProductsToCache = function (a) {
                      for (var d = a.length - 1; 0 <= d; d--) c = b.getUpdatedProductsMetaData(c, a[d]);
                      b.triggerSwymEvent(b.JSEvents.productsStoreUpdated);
                      b.productMetadataCache.putObject(c);
                  };
                  var d = [],
                      e = {};
                  b.getSwymProductDetails = function (c, f, m, p) {
                      m = h.findProduct(c.epi, m);
                      m.epi ? a(m, c, f, p) : (d.push(c), (e[c.epi] = f), b.fetchCurrentMetadataQueue());
                  };
                  b.fetchCurrentMetadataQueue = function (b, c, f) {
                      var p;
                      b ? (p = d.splice(0, d.length)) : 9 < d.length && (p = d.splice(0, 9));
                      if (p && 0 < p.length) {
                          var n = [];
                          p.forEach(function (a) {
                              n.push({ epi: a.epi, empi: a.empi, et: a.et });
                          });
                          this.getProductMetadata(n, function (b) {
                              p.forEach(function (b) {
                                  var d = O.findProduct(b.epi, c),
                                      g = e[b.epi];
                                  d.epi ? a(d, b, g, f) : (h.productEts.updateEvent(b, !0), h.triggerSwymEvent(h.JSEvents.productInvalidOnLoad, { product: b }), g(b, !0, b));
                              });
                          });
                      }
                  };
                  b.swymProductDetailsQueuesFlush = SwymUtils.debounce(function (a, c, d) {
                      b.fetchCurrentMetadataQueue(a, c, d);
                  }, 500);
              },
          });
          window.SwymIntCallbacks = window.SwymIntCallbacks || [];
          window.SwymIntCallbacks.push(function (a) {
              f.prototype.addToList = function (a, c, d) {
                  ["epi", "empi", "du"].forEach(function (a) {
                      if (!c[a]) throw Error("Add to list call must have epi, empi & du");
                  });
                  if (c.cprops && "object" !== typeof c.cprops) throw Error("cprops should be an object");
                  this.updateListCtx({ lid: a, a: [c] }, function (a) {
                      d(c);
                  });
              };
              f.prototype.updateListItem = function (a, c, d) {
                  ["epi", "empi"].forEach(function (a) {
                      if (!c[a]) throw Error("Add to list call should have epi & empi");
                  });
                  if (c.cprops && "object" !== typeof c.cprops) throw Error("cprops should be an object");
                  this.updateListCtx({ lid: a, u: [c] }, function (a) {
                      d(c);
                  });
              };
              f.prototype.deleteFromList = function (a, c, d) {
                  ["epi", "empi"].forEach(function (a) {
                      if (!c[a]) throw Error("Add to list call should have epi & empi");
                  });
                  if (c.cprops && "object" !== typeof c.cprops) throw Error("cprops should be an object");
                  this.updateListCtx({ lid: a, d: [c] }, function (a) {
                      d(c);
                  });
              };
              f.prototype.updateListCtx = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/update-ctx",
                      params: a,
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.createList = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: a.foruser ? "/lists/create-for" : "/lists/create",
                      params: a,
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.updateList = function (a, c, d) {
                  var e = {};
                  "lid lty lname lnote ldesc lprops".split(" ").forEach(function (c) {
                      e[c] = a[c];
                  });
                  this.swymApiPost({
                      endpoint: "/lists/update",
                      params: e,
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.updateArchivalTime = function (a, c, d) {
                  var e = {};
                  ["lid", "archMs"].forEach(function (c) {
                      e[c] = a[c];
                  });
                  this.swymApiPost({
                      endpoint: "/lists/updateArchivalTime",
                      params: e,
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.fetchListsMine = function (a, c, d) {
                  this.swymApiPost({ endpoint: "/lists/fetch-lists", params: {}, noProvider: !0, useAuthTkn: !0, callbackFn: c, errorFn: d, checkRegId: !0, v3: !0 });
              };
              f.prototype.fetchListsFor = function (a, c, d) {
                  this.swymApiPost({ endpoint: "/lists/fetch-lists-for", params: { foruser: a.foruser }, noProvider: !0, useAuthTkn: !0, sendSessionId: !1, callbackFn: c, errorFn: d, checkRegId: !0, v3: !0 });
              };
              f.prototype.fetchListShares = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/fetch-shares",
                      params: {},
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.fetchLists = function (b) {
                  var c = b.foruser;
                  c
                      ? a.fetchListsFor(
                            { foruser: c },
                            function (a, c) {
                                b.callbackFn && b.callbackFn(a, { sharedWithMe: a, mine: [] }, c);
                            },
                            b.errorFn
                        )
                      : a.fetchListsMine(
                            {},
                            function (c, e) {
                                b.mine
                                    ? b.callbackFn && b.callbackFn(c, { sharedWithMe: [], mine: c }, e)
                                    : a.fetchSharedLists(
                                          {},
                                          function (a) {
                                              b.callbackFn && b.callbackFn(c.concat.apply(c, a), { sharedWithMe: a, mine: c }, e);
                                          },
                                          b.errorFn
                                      );
                            },
                            b.errorFn
                        );
              };
              f.prototype.shareListWith = function (a, c, d, e, f) {
                  this.swymApiPost({
                      endpoint: "/lists/share-with-user",
                      noProvider: !0,
                      useAuthTkn: !0,
                      params: { lid: a, toId: c, note: (f && f.note) || "" },
                      callbackFn: function (a, b) {
                          d && d(a, b);
                      },
                      errorFn: e,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.unshareListWith = function (a, c, d, e) {
                  this.swymApiPost({
                      endpoint: "/lists/unshare-with-user",
                      noProvider: !0,
                      useAuthTkn: !0,
                      params: { lid: a, toId: c },
                      callbackFn: function (a, b) {
                          d && d(a, b);
                      },
                      errorFn: e,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.unshareListFrom = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/unshare-from-user",
                      noProvider: !0,
                      useAuthTkn: !0,
                      params: { lid: a },
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.fetchListCtx = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/fetch-ctx",
                      params: { lid: a },
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.deleteList = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/delete-list",
                      params: { lid: a },
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.markListPublic = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/markPublic",
                      params: { lid: a },
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.markListPrivate = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/markPrivate",
                      params: { lid: a },
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.markListArchived = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/markArchived",
                      params: { lid: a },
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.markListUnarchived = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/markUnarchived",
                      params: { lid: a },
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.fetchSharedLists = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/fetch-assigned-lists",
                      params: {},
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.assignListTo = function (a, c, d, e) {
                  this.swymApiPost({
                      endpoint: "/lists/assign-to-user",
                      noProvider: !0,
                      useAuthTkn: !0,
                      params: { assignTo: a, note: (e && e.note) || "" },
                      callbackFn: function (a, b) {
                          c && c(a, b);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.notifyStore = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/notify-store",
                      noProvider: !0,
                      useAuthTkn: !0,
                      params: { note: (d && d.note) || "" },
                      callbackFn: function (c, d) {
                          a && a(c, d);
                      },
                      errorFn: c,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.fetchUserMeta = function (a, c) {
                  this.swymApiPost({
                      endpoint: "/lists/usermeta",
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (c, e) {
                          a && a(c, e);
                      },
                      errorFn: c,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.sendEmailList = function (a, c, d, e, f, k, h) {
                  this.sendEmailListInternal(c, d, e, f, a, k, h);
              };
              f.prototype.fetchList = function (a, c, d) {
                  var e = {};
                  ["lid", "excludeArchived"].forEach(function (c) {
                      e[c] = a[c];
                  });
                  this.swymApiPost({
                      endpoint: "/lists/fetch-list",
                      params: e,
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c(a);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.fetchListSharedWith = function (a, c, d) {
                  this.swymApiPost({
                      endpoint: "/lists/fetch-list-shared-with",
                      params: { lid: a },
                      noProvider: !0,
                      useAuthTkn: !0,
                      callbackFn: function (a, b) {
                          c(a);
                      },
                      errorFn: d,
                      checkRegId: !0,
                      v3: !0,
                  });
              };
              f.prototype.sendEmailListInternal = function (a, c, d, e, f, k, h) {
                  if (!SwymUtils.validateEmail(a)) throw Error("Invalid email address");
                  if (!e) throw Error("No list found");
                  a = { toemail: a.toLowerCase(), fromemail: c, note: d, lid: e };
                  this.swymApiPost({ endpoint: "/lists/emailList", noProvider: !0, useAuthTkn: !0, params: a, callbackFn: f, errorFn: k, checkRegId: !0, v3: !0 });
              };
              f.prototype.anonBindEnduserToken = function (b) {
                  a.triggerSwymEvent("sw:anonRevertBindEnduserToken");
                  this.sendRequestV3 = function (c, d) {
                      d.params = d.params || {};
                      d.params.swauthtkn = b;
                      var e = d.errorFn;
                      d.errorFn = function (b, c) {
                          if (401 == c.status) {
                              console.log(c.response);
                              var d;
                              try {
                                  d = JSON.parse(c.response);
                              } catch (f) {}
                              a.anonRevertBindEnduserToken();
                              a.triggerSwymEvent("sw:anonRevertBindEnduserToken", d);
                          }
                          if (e) return orierrorFn.apply(this, arguments);
                      };
                      return f.prototype.sendRequestV3.apply(this, [c, d]);
                  };
              };
              f.prototype.anonRevertBindEnduserToken = function (a) {
                  this.sendRequestV3 = f.prototype.sendRequestV3;
              };
          });
          var cb = {
                  trackPageview: 150,
                  addToWishList: 151,
                  addToCart: 152,
                  replayAddToCart: 153,
                  addToWatchList: 154,
                  sendWatchlist: 155,
                  removeFromWishList: 156,
                  sendEmailWishList: 157,
                  updateWishlistEvent: 158,
                  updateUserPreferences: 159,
                  deleteEvent: 160,
                  fetch: 161,
                  fetchWrtEventType: 162,
                  authCheck: 163,
                  getProductDetails: 164,
                  fetchWrtEventTypeET: 165,
                  fetchWishlistWRTHashtag: 166,
                  addCollectionsToProduct: 167,
                  addProductsToCollection: 168,
                  getAllCollections: 169,
                  removeCollectionsFromProduct: 170,
                  removeProductsFromCollection: 171,
                  removeWishlistCollection: 172,
                  shareWishlistSocial: 173,
                  generateSharedWishlistURL: 174,
              },
              Da = { fetch: !1, fetchWrtEventType: !1, fetchWrtEventTypeET: !1, fetchWishlistWRTHashtag: !1, getProductDetails: !1, authCheck: !1, generateSharedWishlistURL: !1 };
          v.push({
              id: "apiinstrument",
              init: function () {
                  h = this;
                  wb();
              },
          });
          v.push({
              id: "setup",
              events: { readRetailerConfig: "sw:readretailerconfig", initIntegrations: "sw:initintegrations", xhrTrap: "sw:xhrtrap", fetchTrap: "sw:fetchtrap", wsTrap: "sw:wstrap" },
              init: function () {
                  function a() {
                      if (!window.SwymIntCallbacks._swOriPush) {
                          window.SwymIntCallbacks.forEach(function (a) {
                              var b = { SwymTracker: f, SwymUtils: SwymUtils, _swat: t };
                              try {
                                  with (b) a.call(t, t, b);
                              } catch (c) {
                                  SwymUtils.error("Error calling window.SwymIntCallbacks", c, b);
                              }
                          });
                          var a = window.SwymIntCallbacks.push;
                          window.SwymIntCallbacks._swOriPush = a;
                          window.SwymIntCallbacks.push = function (b) {
                              var c = { SwymTracker: f, SwymUtils: SwymUtils, _swat: t };
                              try {
                                  with (c) b.call(t, t, c);
                              } catch (d) {
                                  SwymUtils.error("Error calling window.SwymIntCallbacks", d, c);
                              }
                              a.apply(this, [b]);
                          };
                      }
                  }
                  function b() {
                      m =
                          m ||
                          window[window.SwymRetailerConfig] ||
                          function (a, b) {
                              this[a] = b;
                          };
                      if (m.RetailerId) (m.BaseConfig || getSwymConfig)(), SwymUtils.onDOMReady(c);
                      else {
                          SwymUtils.warn("No Retailer Id specified! Maybe lazy initialized. Keeping in wait");
                          var a = m;
                          m.LoadState ||
                              (SwymUtils.log("Setting load state now"),
                              (m.LoadState = 1),
                              (m = function (c, d) {
                                  var e = a.apply(a, arguments);
                                  m[c] = d;
                                  setTimeout(b, 100);
                                  return e;
                              }),
                              (t.postLoader = window[window.SwymRetailerConfig] = m));
                      }
                  }
                  function c() {
                      SwymUtils.addClass(document.body, "swym-loading");
                      if (2 == m.LoadState)
                          try {
                              n || T(m.PreCallback) || (m.PreCallback.call(t, t), (n = !0));
                          } catch (b) {
                              SwymUtils.error("Error calling continueConfig pre callback", b);
                          }
                      else if (3 == m.LoadState)
                          try {
                              p || T(m.Callback) || (m.Callback.call(t, t), (p = !0));
                          } catch (b) {
                              SwymUtils.error("Error calling continueConfig post callback", b);
                          }
                      else a(), (m.LoadState = 2), d(t);
                  }
                  function d(a) {
                      if (-1 < [].indexOf(m.RetailerId)) a.turnOff();
                      else {
                          if (!T(m.PreCallback))
                              try {
                                  m.PreCallback.call(a, a), (n = !0);
                              } catch (b) {
                                  SwymUtils.error("Error calling config precallback", b);
                              }
                          var c = SwymUtils.getSWAction(),
                              d = SwymUtils.getParameterByName("swfilter");
                          "clearcache" == c
                              ? a.clearSettingsCache()
                              : ("openui" == c || d) &&
                                a.evtLayer.addEventListener(a.JSEvents.readyUI, function () {
                                    a.evtLayer.addEventListener(a.JSEvents.configLoaded, function () {
                                        d && a.ui.setEtAsCurrentFilter(d);
                                        c && a.ui.open();
                                    });
                                });
                          a.setRetailerId(m.RetailerId);
                          a.readRetailerConfig(
                              function (b, c) {
                                  if (b.eventMap)
                                      try {
                                          m.EventMap = decodeURIComponent(atob(b.eventMap));
                                      } catch (d) {
                                          SwymUtils.error("Error loading eventmap", d);
                                      }
                                  else SwymUtils.log("No event map found for retailer");
                                  if (b.settings) {
                                      var n = function () {
                                          SwymUtils.removeClass(document.body, "swym-loading");
                                          SwymUtils.addClass(document.body, "swym-ready");
                                          a.notepad = {
                                              openNotepad: function () {
                                                  a.ui.open.apply(a.ui, arguments);
                                              },
                                              closeNotepad: function () {
                                                  a.ui.close.apply(a.ui, arguments);
                                              },
                                          };
                                          a.retailerSettings.RelayUI = a.retailerSettings.UI;
                                          if (!T(m.Callback))
                                              try {
                                                  m.Callback.call(a, a), (p = !0);
                                              } catch (b) {
                                                  SwymUtils.error("Error calling config postcallback", b);
                                              }
                                          m.LoadState = 3;
                                          a.processCallbacks();
                                          a.triggerSwymEvent(a.JSEvents.configLoaded);
                                          e(a);
                                          h(a);
                                          g(a);
                                      };
                                      m.Settings = JSON.parse(b.settings);
                                      a.retailerSettings = m.Settings;
                                      m.Settings = SwymUtils.deepExtendDefaults(m.Settings, qb);
                                      a.retailerSettings.General.UseFetchWithML &&
                                          (f.prototype.isDefaultBucket = function (a) {
                                              a = this.deviceCache.getObject();
                                              return "A" == (null == a ? "A" : a.all.bkt);
                                          });
                                      a.triggerSwymEvent(a.JSEvents.readRetailerConfig, m);
                                      if (T(m.Settings)) n();
                                      else {
                                          m.HideUIOverride && ((m.Settings.UI.Enabled = !1), (m.Settings.Watchlist.Enabled = !1), (m.Settings.Wishlist.Enabled = !1));
                                          a.setRetailerSettings(m.Settings);
                                          var t = m.Settings.General,
                                              r = m.Settings.UI;
                                          t.Enabled || (a.turnOff(), (r.Enabled = !1), (r = {}));
                                          a.setCurrency(t.Currency);
                                          t = (t.URLTagging || "").toLowerCase();
                                          "utm" == t ? (f.prototype.tagURL = f.prototype.tagURLWithUTM) : "hash" == t && (f.prototype.tagURL = f.prototype.tagURLWithHash);
                                          a.triggerSwymEvent(a.JSEvents.initIntegrations);
                                          a.initializeUi
                                              ? a.initializeUi(function (b) {
                                                    b && (T(m.ProductMigratorData), a.ui.initCustomLaunchPoints());
                                                    n();
                                                })
                                              : n();
                                      }
                                  } else SwymUtils.log("No settings found for retailer");
                              },
                              function () {
                                  SwymUtils.log("Retailer config not found, could be Magento extension", !0);
                              }
                          );
                      }
                  }
                  function e(a) {
                      if (!XMLHttpRequest.prototype._swymd) {
                          XMLHttpRequest.prototype._swymd = !0;
                          var b = XMLHttpRequest.prototype.open;
                          XMLHttpRequest.prototype.open = function (a, c) {
                              try {
                                  (this._swAction = c), (this._swMethod = a), (this._swHeaders = {}), (this._swIsSWAction = -1 < c.indexOf("swymrelay.com|interfaceStore.php"));
                              } catch (d) {
                                  SwymUtils.error("Error -- XHR.open - ", d);
                              }
                              b.apply(this, arguments);
                          };
                          XMLHttpRequest.prototype.open.toString = function () {
                              return "Swym - " + b.toString();
                          };
                          XMLHttpRequest.prototype.wrappedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
                          XMLHttpRequest.prototype.setRequestHeader = function (a, b) {
                              try {
                                  this.wrappedSetRequestHeader(a, b), (this._swHeaders = this._swHeaders || {}), (this._swHeaders[a] = b);
                              } catch (c) {
                                  SwymUtils.error("Error -- XHR.setRequestHeader - ", c);
                              }
                          };
                          XMLHttpRequest.prototype.setRequestHeader.toString = function () {
                              return "Swym - " + this.wrappedSetRequestHeader.toString();
                          };
                          var c = XMLHttpRequest.prototype.send;
                          XMLHttpRequest.prototype.send = function () {
                              try {
                                  if (((this._swData = arguments[0]), (this._swOnSendComplete = null), a.triggerSwymEvent(a.JSEvents.xhrTrap, this), this._swOnSendComplete && this.addEventListener)) {
                                      var b = this;
                                      this.addEventListener("load", function (a) {
                                          b._swOnSendComplete.apply(b, arguments);
                                      });
                                  }
                              } catch (d) {
                                  SwymUtils.error("Error -- XHR.send - ", d);
                              }
                              c.apply(this, arguments);
                          };
                          XMLHttpRequest.prototype.send.toString = function () {
                              return "Swym - " + c.toString();
                          };
                      }
                  }
                  function g(a) {
                      if (window.fetch && !window.fetch.polyfill && !window.fetch._swymd) {
                          window.fetch._swymd = !0;
                          var b = window.fetch;
                          window.fetch = function (c, d) {
                              var e = {};
                              d = d || {};
                              e._swAction = c;
                              e._swMethod = d.method || "GET";
                              e._swHeaders = d.headers || {};
                              e._swData = d.body;
                              a.triggerSwymEvent(a.JSEvents.fetchTrap, e);
                              var f = b.apply(this, arguments);
                              e._swOnSendComplete &&
                                  (f = f.then(function (a) {
                                      e._swOnSendComplete.apply(e, arguments);
                                      return a;
                                  }));
                              return f;
                          };
                      }
                  }
                  function h(a) {
                      if (window.WebSocket && !window.WebSocket._swymd) {
                          window.WebSocket._swymd = !0;
                          var b = window.WebSocket.prototype.send;
                          window.WebSocket.prototype.send = function () {
                              var c = arguments[0];
                              this._swAction = this.url;
                              this._swData = c;
                              a.triggerSwymEvent(a.JSEvents.wsTrap, this);
                              b.apply(this, arguments);
                          };
                      }
                  }
                  window.SwymCallbacks = window.SwymCallbacks || [];
                  window.SwymIntCallbacks = window.SwymIntCallbacks || [];
                  -1 < window.location.hash.indexOf("-swym") && ((window.location.hash = ""), SwymUtils.removeHash());
                  var m,
                      p = !1,
                      n = !1,
                      t = this;
                  t.holdCallbacks = function () {
                      this._holdCallbackLoop = this.retailerSettings && this.retailerSettings.General.LogoutClean && !0;
                  };
                  t.continueCallbacks = function () {
                      this._holdCallbackLoop = !1;
                      this.processCallbacks();
                  };
                  t.processCallbacks = function () {
                      if (3 == m.LoadState && !window.SwymCallbacks._swOriPush && !this._holdCallbackLoop) {
                          if (t.isAlreadyAuth()) {
                              var a = t.storage.get(t.key.POSTLOGINRD);
                              a && a != window.location.pathname && (t.storage.remove(t.key.POSTLOGINRD), (window.location = a));
                          }
                          window.SwymCallbacks.forEach(function (a) {
                              try {
                                  a.call(t, t);
                              } catch (b) {
                                  SwymUtils.error("Error calling window.SwymCallbacks", b);
                              }
                          });
                          var b = window.SwymCallbacks.push;
                          window.SwymCallbacks._swOriPush = b;
                          window.SwymCallbacks.push = function (a) {
                              try {
                                  a.call(t, t);
                              } catch (c) {
                                  SwymUtils.error("Error calling window.SwymCallbacks", c);
                              }
                              b.apply(this, [a]);
                          };
                      }
                  };
                  f.prototype.getRetailerConfig = function (a) {
                      return (m || {})[a];
                  };
                  b();
              },
          });
          v.push({
              id: "wishlist",
              cfg: {
                  Wishlist: {
                      Enabled: !1,
                      ToggleSwitchState: !0,
                      NoButtonInject: !1,
                      EnableFaveCount: !0,
                      FaveCountSelector: ".swym-fave-count",
                      ShowBadge: !0,
                      ShowAddAnimation: !1,
                      TooltipBefore: "Add to Wishlist",
                      TooltipAfter: "Added. <a class='swym-open-ui'>View Wishlist</a>",
                      AllowToggle: !1,
                      AddCTA: "Add to Wishlist",
                      AddedCTA: "Added",
                      ButtonType: "icon",
                      ButtonIcon: "heart",
                      ButtonIconAdded: "",
                      AttachButtonSelector: "",
                      CreateCustomButtonBefore: "",
                      OoSAttachButtonSelector: "",
                      OoSCreateCustomButtonBefore: "",
                      AddClasses: "",
                      DisallowedTags: ["swym-wl-disabled"],
                      AllowSharing: !1,
                      RemoveClasses: "",
                      SharingModes: [
                          { type: "facebook", iconurl: "https://swymdev.azureedge.net/swym-shared/facebook.png", url: "https://www.facebook.com/sharer.php?u={{shareurl}}&t={{note}}" },
                          { type: "twitter", iconurl: "https://swymdev.azureedge.net/swym-shared/twitter.png", url: "https://www.twitter.com/intent/tweet?url={{shareurl}}&text={{note}}" },
                      ],
                      ShareBaseUrl: "{{{storeurl}}}/apps/swymWishlist/shared/index.php?swaction=shared&hkey={{hkey}}&swiu={{#urlEncoded}}{{firstProduct.iu}}{{/urlEncoded}}",
                      ShareShowConnect: !0,
                      ShareShowSiteLogin: !0,
                      ShareWithEmailIconUrl: "https://swymdev.azureedge.net/swym-shared/email-icon.png",
                      EnableCollections: !1,
                      HashtagEditorPreset: [],
                  },
              },
              init: function () {
                  this.evtLayer.addEventListener(this.JSEvents.preReadSettings, function (a) {
                      if ((a = a.detail.d.settings) && 2 != a.General._v && a.Wishlist) {
                          var c = a.Wishlist,
                              d = a.General;
                          ["CreateCustomButton", "CustomFavoriteButtonClass"].forEach(function (a) {
                              delete c[a];
                          });
                          c.NoButtonInject = c.UseCustomButton;
                          [
                              { o: "AttachFavoriteButtonSelector", n: "AttachButtonSelector" },
                              { o: "OoSAttachFavoriteButtonSelector", n: "OoSAttachButtonSelector" },
                          ].forEach(function (a) {
                              SwymUtils.isUndefined(c[a.o]) || ((c[a.n] = c[a.o]), delete c[a.o]);
                          });
                          [
                              { o: "AtLevel", n: "ProductLevel" },
                              { o: "QuickViewPlugin", n: "QuickViewPlugin" },
                          ].forEach(function (a) {
                              SwymUtils.isUndefined(c[a.o]) || ((d[a.n] = c[a.o]), delete c[a.o]);
                          });
                      }
                  });
                  var a = this;
                  a.setupUIModule(
                      "Wishlist",
                      "Wishlist",
                      ["Enabled", "AllowSharing"],
                      function () {
                          a.retailerSettings.UI.Enabled = !0;
                      },
                      function (b) {
                          var c = a.retailerSettings.UI,
                              d = a.retailerSettings.Wishlist,
                              e = c.Color;
                          c.LauncherType && "floating" != c.LauncherType && ((c.LauncherLocation = "custom"), (e = d.ButtonColor));
                          e &&
                              ((b.htmlText +=
                                  "#swym-plugin .swym-primary-background-color {background: " +
                                  e +
                                  " !important;} #swym-plugin .swym-primary-border-color {border-color: " +
                                  e +
                                  " !important;} #swym-plugin .swym-primary-color {color: " +
                                  e +
                                  " !important;}"),
                              (b.htmlText += ".swym-background-color,#swym-notification.swym-santa .swym-image { background-color: " + e + " !important; }"),
                              (b.htmlText += "@media (max-width: 820px){ #swym-plugin #swym-notepad .swym-item-filter li.is-active { background-color: " + e + " !important; } }"),
                              (b.htmlText += ".swym-text-color { color: " + e + " !important; }"));
                          d.ButtonType || (d.ButtonType = "icon");
                          d.ButtonColor &&
                              ((b.htmlText += ".swym-add-to-wishlist-view-product:after{color: " + d.ButtonColor + " !important;}"),
                              (c = ["icon", "btnlink", "iconbtnlink"]),
                              -1 < c.indexOf(d.ButtonType)
                                  ? (b.htmlText += ".swym-add-to-wishlist, .swym-add-to-wishlist:after, .swym-fave-count {color: " + d.ButtonColor + " !important;}")
                                  : (b.htmlText += ".swym-add-to-wishlist {background: " + d.ButtonColor + " !important;, color: #FFF !important;} .swym-add-to-wishlist+.swym-fave-count{border-color: " + d.ButtonColor + " !important;}"),
                              (b.htmlText += "#swym-trigger-email-auth-button {background: " + d.ButtonColor + " !important;, color: #FFF !important;}"));
                          d.AddedButtonColor &&
                              ((b.htmlText += ".swym-added.swym-add-to-wishlist-view-product:after{color: " + d.AddedButtonColor + " !important;}"),
                              (c = ["icon", "btnlink", "iconbtnlink"]),
                              -1 < c.indexOf(d.ButtonType)
                                  ? (b.htmlText += ".swym-added.swym-add-to-wishlist, .swym-added.swym-add-to-wishlist:after, .swym-added.swym-add-to-wishlist + .swym-fave-count {color: " + d.AddedButtonColor + " !important;}")
                                  : (b.htmlText +=
                                        ".swym-added.swym-add-to-wishlist {background: " +
                                        d.AddedButtonColor +
                                        " !important;, color: #FFF !important;} .swym-added.swym-add-to-wishlist+.swym-fave-count{border-color: " +
                                        d.AddedButtonColor +
                                        " !important;}"));
                          "custom" == d.ButtonIcon && d.CustomIcon && (b.htmlText += ".swym-button.swym-add-to-wishlist:after,.swym-button.swym-add-to-wishlist-view-product:after { background-image: url('" + d.CustomIcon + "'); }");
                      },
                      function () {
                          a.retailerSettings.UI.Enabled = !1;
                          a.retailerSettings.UI.SimpleWishlistOnly = !0;
                      }
                  );
              },
          });
          v.push({
              id: "watchlist",
              cfg: {
                  Watchlist: {
                      Enabled: !1,
                      ToggleSwitchState: !0,
                      Topics: ["backinstock"],
                      ButtonType: "icontext",
                      CTA: "",
                      OnlyStock: !0,
                      Tooltip: "",
                      ButtonIcon: "",
                      Position: "left",
                      NoButtonInject: !1,
                      AddClasses: "",
                      RemoveClasses: "",
                      MailingListCheckInPopup: !1,
                      AddToMailingListText: "",
                      VariantSelectorInPopup: !1,
                      InlineForm: !1,
                      Color: "",
                      DisallowedTags: ["swym-disabled"],
                      ShowIfOneOOS: !1,
                  },
              },
              events: { addedToWatchlist: "sw:addedtowatchlist" },
              init: function () {
                  this.evtLayer.addEventListener(this.JSEvents.preReadSettings, function (a) {
                      if ((a = a.detail.d.settings) && 2 != a.General._v && a.Watchlist) {
                          var c = a.Watchlist,
                              d = a.General;
                          ["CreateCustomButton", "CustomFavoriteButtonClass"].forEach(function (a) {
                              delete c[a];
                          });
                          c.NoButtonInject = c.UseCustomButton;
                          [{ o: "addToMailingListText", n: "AddToMailingListText" }].forEach(function (a) {
                              SwymUtils.isUndefined(c[a.o]) || ((c[a.n] = c[a.o]), delete c[a.o]);
                          });
                          [
                              { o: "MailingListCheckInPopup", n: "MailingListCheck" },
                              { o: "AddToMailingListText", n: "AddToMailingListText" },
                          ].forEach(function (a) {
                              SwymUtils.isUndefined(c[a.o]) || (d[a.n] = c[a.o]);
                          });
                      }
                      a.Watchlist.ShowIfOneOOS && ((a.Watchlist.InlineForm = !1), (a.Watchlist.NoButtonInject = !1), (a.Watchlist.VariantSelectorInPopup = !0));
                      a.Watchlist.InlineForm && ((a.Watchlist.NoButtonInject = !0), (a.Watchlist.VariantSelectorInPopup = !1));
                  });
                  var a = this;
                  a.setupUIModule("Watchlist", "Watchlist", ["Enabled"], SwymUtils.EmptyFunction, function (b) {
                      var c = a.retailerSettings.Watchlist;
                      c.Color &&
                          (b.htmlText =
                              "default" == c.Position
                                  ? c.ButtonType && "icon" != c.ButtonType
                                      ? b.htmlText + (".swym-add-to-watchlist { background: " + c.Color + " !important;}")
                                      : b.htmlText + (".swym-add-to-watchlist { color: " + c.Color + " !important;}")
                                  : b.htmlText + (".swym-add-to-watchlist { background: " + c.Color + " !important;}"));
                      c.ButtonType || (c.ButtonType = "icon");
                  });
              },
          });
          u.prototype.setPageType = function (a) {
              a && (this.pageType = a);
          };
          u.prototype.getPageType = function () {
              return this.pageType;
          };
          u.prototype.setNotificationUX = function (a) {
              this.notifyFunction = a;
          };
          u.prototype.isCartPage = function () {
              return this.pageType == this.PageType.CART || this.pageType == this.PageType.PURCHASE;
          };
          u.NTs = {
              2: {
                  priority: 0,
                  nt: 2,
                  hdr: y["2"],
                  requiresProduct: !0,
                  tabEt: 4,
                  noDelay: !0,
                  predicate: function (a, b) {
                      return !0;
                  },
              },
              6: { priority: 4, nt: 6, hdr: y["6"], requiresProduct: !0 },
              7: {
                  priority: 16,
                  nt: 7,
                  msg: y["7.msg"],
                  hdr: y["7"],
                  img: "//s3.amazonaws.com/code.swym.it/code/dev/images/paperplane.png",
                  requiresProduct: !1,
                  tab: "settings",
                  predicate: function (a, b) {
                      var c = a.getRelayLaunches();
                      return c && !a.sw.getSwymEmail() && 10 < c;
                  },
              },
              8: {
                  priority: 17,
                  nt: 8,
                  msg: y["8.msg"],
                  hdr: y["8"],
                  img: "//s3.amazonaws.com/code.swym.it/code/dev/images/bulb.png",
                  requiresProduct: !1,
                  tab: "settings",
                  predicate: function (a, b) {
                      var c = a.getLastLaunch(),
                          d = Date.now();
                      return c && 2592e6 < d - c;
                  },
              },
              10: {
                  priority: 19,
                  nt: 10,
                  msg: y["10.msg"],
                  hdr: y["10"],
                  img: "//s3.amazonaws.com/code.swym.it/code/dev/images/star.png",
                  requiresProduct: !1,
                  tab: "welcome",
                  predicate: function (a, b) {
                      var c = a.getLoads();
                      return c && 10 < c;
                  },
              },
              11: { nt: 11, hdr: y["11"], requiresProduct: !0 },
              12: { nt: 12, hdr: y["12"], requiresProduct: !0 },
              15: { priority: 14, nt: 15, hdr: y["15"], requiresProduct: !0 },
              16: {
                  priority: 5,
                  nt: 16,
                  hdr: y["16"],
                  msg: y["16.msg"],
                  requiresProduct: !1,
                  tab: "settings",
                  predicate: function (a, b) {
                      return !1;
                  },
              },
              25: { priority: 5, nt: 25, hdr: y["25"], requiresProduct: !0 },
              21: { priority: 1, nt: 21, hdr: y["21"], msg: y["21.msg"], threshold: 0.1, tabEt: 3, requiresProduct: !0, expires: 1728e5 },
              23: { priority: 3, nt: 23, hdr: y["23"], msg: y["23.msg"], threshold: 0.1, tabEt: 4, requiresProduct: !0, expires: 1728e5 },
              24: { priority: 4, nt: 24, hdr: y["24"], msg: y["24.msg"], threshold: 0.1, tabEt: 4, requiresProduct: !0, expires: 1728e5 },
              26: { priority: 7, nt: 26, hdr: y["26"], threshold: 3, tabEt: 3, requiresProduct: !0, expires: 1728e5 },
              27: { priority: 7, nt: 27, hdr: y["27"], msg: y["27.msg"], threshold: 3, tabEt: 3, requiresProduct: !0, expires: 1728e5 },
              29: { priority: 9, nt: 29, hdr: y["29"], msg: y["29.msg"], threshold: 3, tabEt: 4, requiresProduct: !0, expires: 1728e5 },
              31: { priority: 15, nt: 31, hdr: y["31"], requiresProduct: !0, expires: 1728e5 },
              32: { priority: 16, nt: 32, hdr: y["32"], requiresProduct: !0, expires: 1728e5 },
              33: { priority: 17, nt: 33, hdr: y["33"], requiresProduct: !0, expires: 1728e5 },
              37: { priority: 9, nt: 37, hdr: y["37"], msg: y["37.msg"], threshold: 3, tabEt: 4, requiresProduct: !0, expires: 1728e5 },
              38: { priority: 9, nt: 38, hdr: y["38"], threshold: 3, tabEt: 4, requiresProduct: !0, expires: 1728e5 },
              39: { priority: 9, nt: 39, hdr: y["39"], threshold: 3, tabEt: 4, requiresProduct: !0, expires: 1728e5 },
          };
          u.NTNames = { addedToWishlist: "2" };
          u.prototype.showEvent = function (a, b) {
              return a.noDelay && a.requiresProduct && b
                  ? a
                  : b && b.du == SwymUtils.getPageURL()
                  ? null
                  : a.requiresProduct
                  ? !b || Date.now() > b.ts + a.expires
                      ? null
                      : this.isShown(b.epi)
                      ? null
                      : this.sw.getCurrentPageData().epi != b.epi
                      ? a
                      : null
                  : !this.isShown(a.nt) && a.predicate(this, b)
                  ? a
                  : null;
          };
          u.prototype.nextNotification = function () {
              if (0 != this.getRemaining() && this.notifyFunction && this.isAllowed()) {
                  var a = Date.now() - this.getNextTS();
                  if (0 > a) clearTimeout(this.timer), (this.timer = window.setTimeout(function () {}, Math.abs(a)));
                  else if (this.isCartPage()) this.scheduleNext(!0);
                  else {
                      a = [];
                      if (this.sw.isDefaultBucket() && this.sw.retailerSettings && this.sw.retailerSettings.Notification.EnableSanta)
                          for (var b in u.NTs) {
                              var c = u.NTs[b];
                              c.requiresProduct || a.push(c);
                          }
                      b = this.getStoredNotifications();
                      a = a.concat(b);
                      a.sort(function (a, b) {
                          return a.score > b.score ? -1 : 1;
                      });
                      a.forEach(function (a) {
                          var b = u.NTs[a.nt];
                          b &&
                              ["hdr", "msg", "callback"].forEach(function (c) {
                                  a[c] = b[c];
                              });
                      });
                      for (var d = a.length, e = 0; e < d; e++)
                          if ((c = this.showEvent(a[e], a[e].product)) && this.isAllowed()) {
                              c.msg && (c.msg = this.sw.Mustache.render(c.msg, c.product));
                              this.notifyFunction(c, c.product);
                              this.decrementRemaining();
                              this.setShown(c.requiresProduct ? c.product.epi : c.nt);
                              c.stored && (b.splice(b.indexOf(c), 1), this.storeNotifications(b));
                              break;
                          }
                      this.scheduleNext();
                  }
              }
          };
          u.prototype.showNoDelayIfPossible = function (a, b) {
              if (this.notifyFunction)
                  if (a && a.noDelay) (a.product = b), this.notifyFunction(a, b), this.scheduleNext(!0);
                  else {
                      var c = this;
                      setTimeout(function () {
                          c.nextNotification();
                      }, 1e4);
                  }
          };
          u.prototype.getRemaining = function () {
              return this.getInfo().nc || 0;
          };
          u.prototype.getNextTS = function () {
              return this.getInfo().nts;
          };
          u.prototype.decrementRemaining = function () {
              var a = this.getInfo();
              --a.nc;
              this.storeInfo(a);
          };
          u.prototype.isAllowed = function () {
              try {
                  return this.sw.retailerSettings.Wishlist.Enabled && 0 != this.sw.retailerSettings.Notification.MaxPerSession && this.sw.isDefaultBucket();
              } catch (a) {}
              return !1;
          };
          u.prototype.scheduleNext = function (a) {
              a = this.getNextTS() + (a ? 6e4 : this.sw.retailerSettings ? this.sw.retailerSettings.Notification.Frequency : 3e5);
              this.setNextTS(a);
              clearTimeout(this.timer);
              this.timer = setTimeout(function () {}, a - Date.now());
          };
          u.prototype.setNextTS = function (a) {
              var b = this.getInfo();
              b.nts = a;
              this.storeInfo(b);
          };
          u.prototype.setRemaining = function (a) {
              var b = this.getInfo();
              b.nc = a;
              this.storeInfo(b);
          };
          u.prototype.trackRelayLaunches = function (a) {
              a = this.getInfo();
              a.rl || (a.rl = 0);
              a.rl += 1;
              this.storeInfo(a);
          };
          u.prototype.getRelayLaunches = function () {
              return this.getInfo().rl;
          };
          u.prototype.trackLastLaunch = function () {
              var a = this.getInfo();
              a.ll = Date.now();
              delete a.lc;
              this.storeInfo(a);
          };
          u.prototype.getLastLaunch = function () {
              return this.getInfo().ll;
          };
          u.prototype.storeInfo = function (a) {
              var b = this.getInfo(),
                  c;
              for (c in a) b[c] = a[c];
              this.storage.set("ninfo", btoa(SwymUtils.getObjectAsEncoded(b)));
          };
          u.prototype.getInfo = function () {
              var a = this.storage.get("ninfo");
              try {
                  return a ? SwymUtils.getEncodedAsObject(atob(a), parseInt) : {};
              } catch (b) {
                  SwymUtils.error("ninfo crossed threshold, resetting", b, a);
              }
              return {};
          };
          u.prototype.trackLoads = function () {
              var a = this.getInfo();
              a.ll ? delete a.lc : (a.lc || (a.lc = 0), (a.lc += 1));
              this.storeInfo(a);
          };
          u.prototype.getLoads = function () {
              return this.getInfo().lc;
          };
          u.prototype.setShown = function (a) {
              var b = this.getInfo();
              b[a + "_s"] = 1;
              this.storeInfo(b);
          };
          u.prototype.isShown = function (a) {
              return 1 == this.getInfo()[a + "_s"];
          };
          u.prototype.cleanNtObj = function (a) {
              ["hdr", "msg", "callback"].forEach(function (b) {
                  delete a[b];
              });
              return a;
          };
          u.prototype.fetchNotifications = function () {
              var a = this;
              this.sw.fetchUpdatesForNotifications
                  ? this.sw.fetchUpdatesForNotifications(
                        function (b) {
                            a.processNotifications(b.products);
                        },
                        "sa",
                        !1,
                        null,
                        !1
                    )
                  : a.processNotifications([]);
          };
          u.prototype.processNotifications = function (a) {
              var b = this.getStoredNotifications();
              a = a.sort(function (a, b) {
                  return a.score > b.score ? -1 : 1;
              });
              for (var c = 0; c < a.length; c++) {
                  var d = a[c],
                      e;
                  if (u.NTs.hasOwnProperty(d.nt))
                      if (
                          d
                              ? b.some(function (a) {
                                    e = a;
                                    return a.nt == d.nt && a.product.epi == d.epi;
                                })
                              : b.some(function (a) {
                                    return a.nt == d.nt;
                                })
                      )
                          e && ((e.product = this.sw.decorateProduct(d, "tooltip")), (e.stored = !0));
                      else {
                          var f = SwymUtils.deepcopy(u.NTs[d.nt]),
                              f = this.cleanNtObj(f);
                          f.product = this.sw.decorateProduct(d, "tooltip");
                          f.stored = !0;
                          b.push(f);
                      }
              }
              this.storeNotifications(b);
          };
          u.prototype.getStoredNotifications = function () {
              return (this.localNotifsJson = this.notifCache.getObject() || this.localNotifsJson);
          };
          u.prototype.storeNotifications = function (a) {
              this.localNotifsJson = a = a.filter(function (a) {
                  return a.expires ? Date.now() < a.product.ts + a.expires : !0;
              });
              this.notifCache.putObject(a);
          };
          window.SwymNE = u;
          v.push({
              id: "notifier",
              cfg: { Notification: { Enabled: !1, MaxPerSession: 0, Frequency: 3e5, EnableSanta: !1, EnableStockCheck: !1, EnablePriceCheck: !1, NTs: {} } },
              init: function () {
                  this.ne = new u(this.storage, this);
              },
          });
          v.push({
              id: "widget",
              events: { fetchWidget: "sw:fetchwidget", renderWidget: "sw:renderwidget", fetchShared: "sw:fetchshared", renderShared: "sw:rendershared" },
              cfg: { Widget: { Enabled: !1, RenderCfg: { type: "grid", gridtmpl: "", itemtmpl: "", loadingtmpl: "", cols: { mobile: 1, tablet: 3, desktop: 4 }, actions: [1], attrs: [] }, Defs: [] } },
              instruments: {},
              init: function () {
                  function a(a) {
                      SwymUtils.removeClass(a.grid, "loading");
                      SwymUtils.addClass(a.grid, "loaded");
                  }
                  function b(a, b) {
                      SwymUtils.addClass(a, "loading");
                  }
                  function c(a, b) {
                      SwymUtils.addClass(a, "error");
                  }
                  function d(a, b) {
                      var c = h[a];
                      return "sw-rfr=" + (h[a + "-" + b] || c || h.site).toString(16);
                  }
                  this.sharedWlApi = new this.FetchModel({
                      name: "shared",
                      hashFn: function (a) {
                          return a.hkey;
                      },
                      internalFn: function (a, b, c) {
                          this.swat.swymApiPost({ endpoint: "/getSharedWishlist", v2: !0, params: { hkey: a.params.hkey }, callbackFn: b, sendRegId: !1, sendSessionId: !1, errorFn: c });
                      },
                  });
                  this.widgetProductsApi = new this.FetchModel({
                      name: "widget",
                      hashFn: function (a) {
                          return a.type;
                      },
                      internalFn: function (a, b, c) {
                          a = a.params;
                          this.swat.swymApiPost({ endpoint: "/widgets/getWidgetData", v2: !0, params: { querytype: a.type, n: a.n, days: a.days }, callbackFn: b, checkRegId: !1, sendRegId: !1, sendSessionId: !1, errorFn: c });
                      },
                  });
                  this.widgetProductsApi.fetchWrtType = function (a, b) {
                      var c = a.src || "site",
                          e = a.pos;
                      m.widgetProductsApi.fetch({
                          params: { type: a.type, n: a.n || 10, days: a.days || 30 },
                          scb: function (a) {
                              var f = JSON.parse(JSON.stringify(a.productmetadata)),
                                  g = d(c, e);
                              f.forEach(function (a) {
                                  var b = a.uri,
                                      c = -1 < b.indexOf("?") ? "&" : "?";
                                  a.uri = b + c + g;
                              });
                              b(f, a.querystr);
                          },
                          lcb: function () {
                              a.lcb && a.lcb(this, arguments);
                          },
                          fcb: function () {
                              a.fcb && a.fcb.apply(this, arguments);
                          },
                      });
                  };
                  var e,
                      f,
                      h = { site: 1e4, "site-collections": 10002, "site-product": 10001, "site-cart": 10003, "site-wishlist": 10004, "site-page": 10005, "site-checkout": 10006 };
                  this.widget = {
                      init: function () {
                          e.Defs.filter(function (a) {
                              return a.enabled;
                          }).forEach(function (d) {
                              d.containers
                                  .filter(function (a) {
                                      return a.allowedurl ? -1 < location.href.search(new RegExp(a.allowedurl)) : !0;
                                  })
                                  .filter(function (a) {
                                      return a.disallowedurl ? -1 == location.href.search(new RegeExp(a.disallowedurl)) : !0;
                                  })
                                  .filter(function (a) {
                                      return !!document.querySelector(a.selector);
                                  })
                                  .forEach(function (f) {
                                      this.createContainer({ type: d.type, render: f.render || e.RenderCfg, id: d.type + "_" + f.id, selector: f.selector, src: f.src, pos: f.pos, n: d.n, days: d.days }, a, b, c);
                                  }, this);
                          }, this);
                      },
                      renderContainer: function (a) {
                          a.render.iscarousel = "carousel" == a.render.type;
                          a.render.widths = {};
                          for (var b in a.render.cols) a.render.widths[b] = 100 / a.render.cols[b];
                          b = SwymUtils.renderTemplate(f.WidgetContainer, a);
                          a = document.createDocumentFragment();
                          var c = document.createElement("div");
                          c.innerHTML = b;
                          b = c.children[0];
                          a.appendChild(b);
                          return b;
                      },
                      createContainer: function (a, b, c, d) {
                          var e = this.renderContainer(a),
                              f = e.querySelector(".swym-products-loop");
                          a.lcb = function () {
                              c(e, f);
                          };
                          a.fcb = function () {
                              SwymUtils.error("Error fetching widget", arguments);
                              d(null);
                          };
                          m.widgetProductsApi.fetchWrtType(a, function (c, d) {
                              var g = m.widget.renderProducts(f, a.render, c, !0),
                                  g = { grid: e, productsElem: g, products: c, query: d, cfg: a };
                              m.triggerSwymEvent(m.JSEvents.renderWidget, g);
                              document.querySelector(g.cfg.selector).appendChild(e);
                              b(g);
                          });
                      },
                      refreshContainer: function (a, b) {},
                      renderProduct: function (a, b) {
                          b = SwymUtils.formatProductPrice(b);
                          [
                              ["dt", "title"],
                              ["du", "uri"],
                          ].forEach(function (a) {
                              b[a[0]] = b[a[0]] || b[a[1]];
                          });
                          b.render = a;
                          return SwymUtils.renderTemplate(f.ProductGridItem, b);
                      },
                      renderProducts: function (a, b, c, d) {
                          c.forEach(function (c, d) {
                              var e = document.createElement("li");
                              e.setAttribute("data-idx", d);
                              e.className = "swym-product-grid-li";
                              e.innerHTML = this.renderProduct(b, c);
                              a.appendChild(e);
                          }, this);
                          -1 < b.actions.indexOf(1) &&
                              m.retailerSettings.UI.Enabled &&
                              SwymUtils.addEventDelegate(a, "click", ".swym-product-grid-hyperlink", function (a) {
                                  a.stopPropagation();
                                  a.preventDefault();
                                  a = SwymUtils.getClosest(this, ".swym-product-grid-li").getAttribute("data-idx");
                                  m.ui.openProductSwiper({ uri: c[a].du, epi: c[a].epi, products: c });
                              });
                          return a;
                      },
                      renderSharedWishlist: function (a, b, c, d) {
                          if (m.retailerSettings.Wishlist.Enabled) {
                              var f = m.retailerSettings.Wishlist.SharingViewConfig || e.RenderCfg,
                                  g = { id: "shared-" + a, render: f },
                                  h = m.widget.renderContainer(g),
                                  k = h.querySelector(".swym-products-loop");
                              m.sharedWlApi.fetch({
                                  params: { hkey: a },
                                  scb: function (a) {
                                      var c = JSON.parse(JSON.stringify(a.queryres)),
                                          d = m.widget.renderProducts(k, f, c, !0);
                                      a = { grid: h, productsElem: d, products: c, query: a.querystr, cfg: g };
                                      m.triggerSwymEvent(m.JSEvents.renderShared, a);
                                      b(a);
                                  },
                                  lcb: function () {
                                      c(h, k);
                                  },
                                  fcb: function () {
                                      SwymUtils.error("Error fetching shared wishlist", arguments);
                                      d(null);
                                  },
                              });
                              m.instrument(m.Instrumentations.SharedWishlistOpen, { hkey: a });
                              a = m.getCurrentPageData();
                              a.et = m.EventTypes.sharedWishlistView;
                              m.api.trackPageview(a);
                          } else d("Wishlist not enabled");
                      },
                  };
                  var m = this;
                  this.evtLayer.addEventListener(this.JSEvents.initIntegrations, function () {
                      e = m.retailerSettings.Widget;
                      f = m.retailerSettings.Templates;
                      m.retailerSettings.Widget.Enabled &&
                          0 < e.Defs.length &&
                          m.evtLayer.addEventListener(m.JSEvents.renderUI, function () {
                              m.widget.init();
                          });
                  });
              },
          });
          f.prototype.initShareWishlist = function () {
              var a = new this.FetchModel({
                  name: "wishlisthkey",
                  hashFn: function (a) {
                      return a.hashtag ? a.hashtag : "all";
                  },
                  preloadHashFn: function (a, c) {
                      return "all";
                  },
                  cacheStaleEvts: [this.JSEvents.fetchProducts].concat(this.FetchModel.defaultOpts.cacheStaleEvts),
                  gSEvtNames: [this.JSEvents.hashkeyReceived],
                  internalFn: function (a, c, d) {
                      this.swat.swymApiPost({
                          endpoint: a.params.hashtag ? "/shareWishlist" : "/shareSimpleWishlist",
                          params: a.params.hashtag ? { hashtag: a.params.hashtag } : {},
                          callbackFn: c,
                          errorFn: d,
                          checkRegId: !0,
                          sendSessionId: !1,
                          v2: !0,
                      });
                  },
              });
              this.exports("wishlistHashkey", a);
          };
          f.prototype.generateSharedWishlistURL = function (a, b, c) {
              var d = this.retailerSettings.Wishlist.ShareBaseUrl,
                  e = this;
              this.wishlistHashkey.fetch({
                  params: { hashtag: a },
                  scb: function (a) {
                      if (a.error) c(a.error);
                      else {
                          var f = a.hash,
                              h = SwymUtils.getCurrentPrimaryUrlWithProtocol();
                          e.triggerSwymEvent(e.JSEvents.hashkeyReceived, { hash: a.hash });
                          var p = {};
                          try {
                              p = e.productEts.quickFindForEpi(a.epis[0]);
                          } catch (n) {}
                          a = SwymUtils.renderTemplateString(d, {
                              storeurl: h,
                              hkey: f,
                              firstProduct: p,
                              urlEncoded: function () {
                                  return function (a, b) {
                                      return encodeURIComponent(b(a));
                                  };
                              },
                          });
                          a = SwymUtils.annotateUrl(a, "Wishlist", "shared-wishlist", f);
                          b(a);
                      }
                  },
                  fcb: function (a) {
                      c(a);
                  },
              });
          };
          f.prototype.shareWishlistSocial = function (a, b, c, d, e) {
              this.api.generateSharedWishlistURL(
                  a,
                  function (a) {
                      a += "&utm_content=" + c;
                      a = SwymUtils.renderTemplateString(b, { note: encodeURIComponent(d).replace(/[!'()*]/g, escape), shareurl: encodeURIComponent(a) });
                      window.open(a, "_blank", "toolbar=1,status=1,resizable=1,scrollbars=1,width=626,height=436");
                  },
                  function (a) {
                      e(a);
                  }
              );
          };
          f.prototype.openShareWishlistSocial = function (a, b, c) {
              var d = !0;
              this.retailerSettings.Wishlist.AllowSharing || (d = !1);
              this.ui.toggleShareWishlistSocialUi(a, d, b, c);
          };
          v.push({
              id: "sharewishlist",
              init: function () {
                  var a = this,
                      b = { hashkeyReceived: "sw:hashkeyReceived" },
                      c;
                  for (c in b) f.JSEvents[c] = b[c];
                  a.evtLayer.addEventListener(a.JSEvents.initIntegrations, function () {
                      a.retailerSettings.Wishlist.AllowSharing && a.initShareWishlist();
                  });
              },
          });
          f.prototype.addCollectionsToProduct = function (a, b, c, d) {
              this.productEts.updateProductCollections(a, { action: "ADD", collections: b }, c, d);
          };
          f.prototype.removeCollectionsFromProduct = function (a, b, c, d) {
              this.productEts.updateProductCollections(a, { action: "REMOVE", collections: b }, c, d);
          };
          f.prototype.getCollectionsForProduct = function (a) {
              return this.productEts.getCollectionsForProduct(a);
          };
          f.prototype.getAllCollections = function (a, b) {
              var c = this;
              b
                  ? a(c.productEts.collectionToProducts)
                  : this.api.fetch(function () {
                        setTimeout(function () {
                            a(c.productEts.collectionToProducts);
                        });
                    });
          };
          f.prototype.addProductsToCollection = function (a, b, c, d) {
              this.productEts.updateProductsInCollection(a, { action: "ADD", epis: b }, c, d);
          };
          f.prototype.removeProductsFromCollection = function (a, b, c, d) {
              this.productEts.updateProductsInCollection(a, { action: "REMOVE", epis: b }, c, d);
          };
          f.prototype.getProductsForCollection = function (a) {
              return this.productEts.getProductsForCollection(a);
          };
          f.prototype.fetchWishlistWRTHashtag = function (a, b, c) {
              this.api.fetchWrtEventTypeET(function (c) {
                  c = c.filter(function (a) {
                      return a.hashtags && -1 < a.hashtags.indexOf(b);
                  });
                  a(c);
              }, h.EventTypes.addToWishlist);
          };
          f.prototype.removeWishlistCollection = function (a, b, c) {
              var d = this;
              this.swymApiPost({
                  endpoint: "/removeWishlistCollection",
                  params: { hashtag: a },
                  callbackFn: function (a, c) {
                      d.triggerSwymEvent(f.JSEvents.removeWishlistCollection, {});
                      d.productEts.makeCacheStale();
                      b(a);
                  },
                  errorFn: c,
                  checkRegId: !0,
                  sendSessionId: !1,
                  v2: !0,
              });
          };
          f.prototype.createProductCollectionsMapping = function (a) {
              this.productEts.newEpiToCollections = {};
              this.productEts.epiToCollections = {};
              this.productEts.collectionToProducts = {};
              this.productEts.epiToEpikeys = {};
              for (var b, c = 0; c < a.length; c++) (b = a[c]), (this.productEts.epiToCollections[b.epi] = b.hashtags ? b.hashtags : []), (this.productEts.epiToEpikeys[b.epi] = b.epi);
              this.createCollectionProductsMapping();
              this.triggerSwymEvent(this.JSEvents.updatedWishlistCollections, this.productEts.collectionToProducts);
          };
          f.prototype.createCollectionProductsMapping = function () {
              var a = this.productEts.epiToCollections,
                  b = this,
                  c;
              for (epi in a)
                  (c = a[epi]),
                      c.forEach(function (a) {
                          b.productEts.collectionToProducts[a] ? b.productEts.collectionToProducts[a].push(epi) : (b.productEts.collectionToProducts[a] = [epi]);
                      }),
                      delete this.productEts.newEpiToCollections[epi];
          };
          f.prototype.initWishlistCollections = function () {
              var a = this;
              this.api.fetchWrtEventTypeET(function (b) {
                  a.createProductCollectionsMapping(b);
              }, this.EventTypes.addToWishList);
              this.productEts.getCollectionsForProduct = function (a) {
                  var c = [];
                  this.epiToCollections[a] ? (c = this.epiToCollections[a]) : this.newEpiToCollections[a] && (c = this.newEpiToCollections[a]);
                  return c;
              };
              this.productEts.updateCollectionsForNewItem = function (a, c, d, e) {
                  this.newEpiToCollections[a] = this.getUpdatedCollectionsForProduct(a, c, this.newEpiToCollections);
                  d(this.newEpiToCollections[a]);
              };
              this.productEts.getUpdatedCollectionsForProduct = function (a, c, d) {
                  for (var e = [], f = 0, h = d[a].length; f < h; f++) e.push(d[a][f]);
                  var m;
                  c.collections.forEach(function (a) {
                      m = e.indexOf(a);
                      "REMOVE" == c.action ? 0 <= m && e.splice(m, 1) : "ADD" == c.action && -1 == m && e.push(a);
                  });
                  return e;
              };
              this.productEts.updateProductCollections = function (b, c, d, e) {
                  if (this.epiToCollections[b]) {
                      var g = this.getUpdatedCollectionsForProduct(b, c, this.epiToCollections);
                      a.swymApiPost({
                          endpoint: "/updateProductWishlistEvent",
                          params: { "epi-data": JSON.stringify([{ epi: b, hashtags: g }]) },
                          callbackFn: function (c, e) {
                              a.productEts.makeCacheStale();
                              a.productEts.epiToCollections[b] = g;
                              a.triggerSwymEvent(f.JSEvents.updateCollectionsForProduct, {});
                              d(c);
                          },
                          errorFn: e,
                          checkRegId: !0,
                          sendSessionId: !1,
                          v2: !0,
                      });
                  } else this.updateCollectionsForNewItem(b, c, d, e);
              };
              this.productEts.updateProductHashtags = function (b, c, d, e) {
                  a.swymApiPost({
                      endpoint: "/updateProductWishlistEvent",
                      params: { "epi-data": JSON.stringify([{ epi: b, hashtags: c }]) },
                      callbackFn: function (e, h) {
                          a.productEts.makeCacheStale();
                          a.productEts.epiToCollections[b] = c;
                          a.triggerSwymEvent(f.JSEvents.updateCollectionsForProduct, {});
                          d(e);
                      },
                      errorFn: e,
                      checkRegId: !0,
                      sendSessionId: !1,
                      v2: !0,
                  });
              };
              this.productEts.getUpdatedProductsForCollection = function (a, c, d) {
                  d[a] || (d[a] = []);
                  var e = d[a],
                      f;
                  c.epis.forEach(function (a) {
                      f = e.indexOf(a);
                      "REMOVE" == c.action ? 0 <= f && e.splice(f, 1) : "ADD" == c.action && -1 == f && e.push(a);
                  });
                  return e;
              };
              this.productEts.updateProductsInCollection = function (b, c, d, e) {
                  var g = this.getUpdatedProductsForCollection(b, c, this.collectionToProducts),
                      h = [];
                  g.forEach(function (a) {
                      h.push({ epi: this.epiToEpikeys[a], hashtags: this.getCollectionsForProduct(a) });
                  }, this);
                  a.swymApiPost({
                      endpoint: "/updateProductWishlistEvent",
                      params: { "epi-data": h },
                      callbackFn: function (c, e) {
                          a.productEts.collectionToProducts[b] = g;
                          a.triggerSwymEvent(f.JSEvents.updateProductsInCollection, {});
                          d(c);
                      },
                      errorFn: e,
                      checkRegId: !0,
                      sendSessionId: !1,
                      v2: !0,
                  });
              };
              this.productEts.getProductsForCollection = function (a) {
                  return this.collectionToProducts[a];
              };
              a.evtLayer.addEventListener(h.JSEvents.fetchProducts, function (b) {
                  a.createProductCollectionsMapping(a.productEts.filterEvents(b.detail.d, a.EventTypes.addToWishList));
              });
              a.evtLayer.addEventListener(h.JSEvents.productsCacheUpdated, function (b) {
                  b = b.detail.d.all.filter(function (b) {
                      return b.et == a.EventTypes.addToWishList;
                  });
                  a.createProductCollectionsMapping(b);
              });
              a.evtLayer.addEventListener(h.JSEvents.beforeCollect, function (b) {
                  b = b.detail.d;
                  if (b.et == a.EventTypes.addToWishList) {
                      var c = a.productEts.getCollectionsForProduct(b.epi);
                      0 < c.length && (b.hashtags = c);
                  }
              });
          };
          v.push({
              id: "collections",
              init: function () {
                  var a = this,
                      b = {
                          updateProductsInCollection: "sw:updateproductsincollection",
                          updateCollectionsForProduct: "sw:updatecollectionsforproduct",
                          removeWishlistCollection: "sw:removewishlistcollection",
                          updatedWishlistCollections: "sw:updatedwishlistcollections",
                      },
                      c;
                  for (c in b) f.JSEvents[c] = b[c];
                  a.evtLayer.addEventListener(a.JSEvents.initIntegrations, function () {
                      a.retailerSettings.Wishlist.EnableCollections && a.initWishlistCollections();
                  });
              },
          });
          (function () {
              function a(a, b, c, d) {
                  function e(a) {
                      a = document.getElementById("swym-social-share-container");
                      var b = document.getElementById("swym-share-with-email-container"),
                          c = document.getElementById("swym-no-authentication-share-container");
                      SwymUtils.removeClass(b, "show-container");
                      SwymUtils.addClass(b, "hide-container");
                      SwymUtils.removeClass(a, "show-container");
                      SwymUtils.addClass(a, "hide-container");
                      SwymUtils.removeClass(c, "hide-container");
                      SwymUtils.addClass(c, "show-container");
                      a = document.getElementById("swym-login-for-share-button");
                      b = document.getElementById("swym-connect-for-share-button");
                      SwymUtils.addEvent(a, "click", function (a) {
                          a.preventDefault();
                          l.instrument(l.Instrumentations.LoginForShareButtonClicked, {});
                          window.location = pa.LoginPath;
                      });
                      SwymUtils.addEvent(b, "click", function (a) {
                          a.preventDefault();
                          l.instrument(l.Instrumentations.ConnectForShareWishlistButtonClicked, {});
                          O.ui.changeTab("settings");
                      });
                  }
                  c = { shareOptions: Z.SharingModes, showConnect: Z.ShareShowConnect, showSiteLogin: Z.ShareShowSiteLogin, shareWithEmailIconUrl: Z.ShareWithEmailIconUrl };
                  a.preventDefault();
                  var f = document.getElementById("swym-notepad"),
                      g = document.getElementById("swym-email-container");
                  a = document.getElementById("swym-email-friend-input");
                  d = document.getElementById("swym-social-share-container");
                  var h = document.getElementById("swym-share-modal-close");
                  document.getElementById("swym-share-with-email-container");
                  var k = document.getElementById("swym-no-authentication-share-container");
                  b &&
                      (d && g.removeChild(d),
                      k && g.removeChild(k),
                      (c = SwymUtils.renderTemplate(M.SocialShareBlock, c)),
                      g.insertAdjacentHTML("afterbegin", c),
                      SwymUtils.forEachElement(".swym-email-popup-title", function (a) {
                          SwymUtils.addClass(a, "align-center");
                      }));
                  if (SwymUtils.hasClass(g, "is-active"))
                      SwymUtils.removeClass(g, "is-active"),
                          SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                              SwymUtils.removeClass(a, "show-tab-overlay");
                          }),
                          (g.onclick = null),
                          (f.onclick = null),
                          (h.onclick = null),
                          a.blur();
                  else if (
                      (SwymUtils.addClass(g, "is-active"),
                      (f.onclick = null),
                      l.instrument(l.Instrumentations.OpenEmailMyFaves),
                      a.focus(),
                      SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                          SwymUtils.addClass(a, "show-tab-overlay");
                      }),
                      setTimeout(function () {
                          g.onclick = function (a) {
                              a.stopPropagation();
                          };
                          h.onclick = function (a) {
                              a.preventDefault();
                              SwymUtils.removeClass(g, "is-active");
                              SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                                  SwymUtils.removeClass(a, "show-tab-overlay");
                              });
                              g.onclick = null;
                              f.onclick = null;
                              h.onclick = null;
                          };
                          f.onclick = function () {
                              SwymUtils.removeClass(g, "is-active");
                              SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                                  SwymUtils.removeClass(a, "show-tab-overlay");
                              });
                              g.onclick = null;
                              f.onclick = null;
                              h.onclick = null;
                          };
                      }, 10),
                      b)
                  ) {
                      b = document.getElementById("swym-social-share-container");
                      var m = document.getElementById("swym-social-share-string");
                      SwymUtils.removeClass(document.getElementById("swym-share-with-email-container"), "show-container");
                      SwymUtils.addClass(document.getElementById("swym-share-with-email-container"), "hide-container");
                      c = l.storage.get("currentHashtag");
                      var p = c == J.Title ? null : c;
                      l.api.generateSharedWishlistURL(
                          p,
                          function (a) {
                              l.instrument(l.Instrumentations.ShareWishlistHashCreated);
                              m.value = SwymUtils.renderTemplateString(q.DefaultSharingNote, { url: a });
                          },
                          function (a) {
                              e(a);
                          }
                      );
                      b = b.querySelectorAll(".share-platform-options .share-option a.share-link");
                      for (c = 0; c < b.length; c++)
                          SwymUtils.addEvent(b[c], "click", function (a) {
                              a.preventDefault();
                              a = this.getAttribute("data-type");
                              var b = this.getAttribute("data-url"),
                                  c = document.getElementById("swym-share-with-email-container");
                              "email" == a
                                  ? (SwymUtils.hasClass(c, "show-container")
                                        ? (SwymUtils.removeClass(c, "show-container"), SwymUtils.addClass(c, "hide-container"))
                                        : (SwymUtils.addClass(c, "show-container"), SwymUtils.removeClass(c, "hide-container")),
                                    m.offsetParent ? SwymUtils.hideElem(m) : SwymUtils.showElem(m))
                                  : ((c = m.value.trim().replace(/(\r\n|\n|\r)/gm, "")),
                                    l.instrument(l.Instrumentations.ShareWishlistViaMedium, { medium: a }),
                                    l.api.shareWishlistSocial(p, b, a, c, function (a) {
                                        e(a);
                                    }));
                          });
                  }
              }
              function b(a, b) {
                  function c(b) {
                      function e(a) {
                          var b = document.getElementById("swym-trigger-email-auth-input"),
                              c = document.getElementById("swym-trigger-email-auth-button"),
                              g = document.getElementById("swym-trigger-auth-message"),
                              h = !1;
                          pa.MailingListCheck && (h = document.getElementById("swym-trigger-add-to-mailing-list-input").checked);
                          a
                              ? SwymUtils.validateEmail(b.value)
                                  ? ((g.innerHTML = ""),
                                    SwymUtils.addClass(c, "swym-loading"),
                                    (f = c.disabled = !0),
                                    l.updateUserEmailPreference(
                                        b.value,
                                        a,
                                        h,
                                        function (a) {
                                            SwymUtils.removeClass(c, "swym-loading");
                                            c.disabled = !1;
                                            message = q.EmailPreferencesSubscribeSuccess;
                                            d("success", message);
                                        },
                                        function (a) {
                                            SwymUtils.removeClass(c, "swym-loading");
                                            c.disabled = !1;
                                            message = q.EmailPreferencesSubscribeError;
                                            d("error", message);
                                        }
                                    ),
                                    (f = !0))
                                  : d("error", q.MsgInvalidEmail)
                              : (SwymUtils.validateEmail(b.value)
                                    ? l.updateUserEmailPreference(
                                          b.value,
                                          a,
                                          h,
                                          function (a) {},
                                          function (a) {}
                                      )
                                    : l.setSwymUserPref({ SendEmail: { enabled: !1 } }),
                                w());
                      }
                      Z.AddToMailingListChecked && pa.MailingListCheck && (document.querySelector("#swym-trigger-add-to-mailing-list-input").checked = !0);
                      if (g) {
                          document.querySelector(".swym-tab-modal-content").style.background = g.PopupBackgroundColor;
                          var k = document.getElementById("swym-trigger-remind-wishlist-input");
                          b = document.getElementById("swym-trigger-add-to-mailing-list-input");
                          k &&
                              b &&
                              b.addEventListener("change", function () {
                                  this.checked && !k.checked ? ((k.checked = !0), (k.disabled = !0)) : this.checked && k.checked && !k.disabled ? (k.disabled = !0) : k.disabled && (k.disabled = !1);
                              });
                          l.storage.remove("sessionTimeSeconds");
                      }
                      b = document.getElementById("swym-trigger-email-auth-input");
                      var m = l.getSwymEmail() || l.storage.get(l.key.WEML);
                      m && (b.value = m);
                      (b = document.getElementById("swym-trigger-auth-form")) &&
                          SwymUtils.addEvent(b, "submit", function (a) {
                              a.preventDefault();
                              document.getElementById("swym-trigger-email-auth-button").click();
                          });
                      SwymUtils.addEvent(document.getElementById("swym-trigger-email-auth-button"), "click", function (a) {
                          a = document.getElementById("swym-trigger-remind-wishlist-input");
                          var b = document.getElementById("swym-trigger-email-auth-input"),
                              c = !1;
                          pa.MailingListCheck && (c = document.getElementById("swym-trigger-add-to-mailing-list-input").checked);
                          if (SwymUtils.validateEmail(b.value))
                              if (g) {
                                  if (
                                      (h ||
                                          l.remoteAuthRequest(
                                              function () {
                                                  d("success", q.AuthMsgConnectSuccess);
                                              },
                                              function () {},
                                              b.value
                                          ),
                                      (a && a.checked) || c || !a)
                                  )
                                      e(!0), l.instrument(l.Instrumentations.TriggerPermissionGranted);
                              } else e(!0), l.instrument(l.Instrumentations.TriggerPermissionGranted);
                          else d("error", q.MsgInvalidEmail);
                      });
                      g ||
                          SwymUtils.addEvent(document.getElementById("swym-trigger-email-auth-deny"), "click", function (a) {
                              e(!1);
                              l.instrument(l.Instrumentations.TriggerPermissionDenied);
                          });
                      a();
                  }
                  function d(a, b) {
                      document.getElementById("swym-trigger-auth-message").innerHTML = SwymUtils.renderTemplateString('<span class="swym-{{type}}">{{message}}</span>', { type: a, message: b });
                  }
                  var e = {},
                      f = !1,
                      g = l.retailerSettings.Wishlist.WishlistReminderPopup;
                  pa.MailingListCheck && (e.showMailingListCheckbox = !0);
                  if (g) {
                      e.ButtonStyleString = "background: " + g.ButtonColor + " !important;";
                      e.PopupBodyStyleString = "background: " + g.PopupBackgroundColor + " !important; font-family: " + g.FontFamily;
                      e.showDenyButton = !1;
                      var h = l.isSwymAuthn();
                      if (h) (e.showRemindWishlistCheckbox = !1), (e.PopupTitle = q.GetTriggerPermissionTitle), (e.PopupDesc = q.GetTriggerPermissionDesc);
                      else if (g.ShowEmailCapture) (e.showRemindWishlistCheckbox = !0), (e.PopupTitle = q.GetSaveWishlistTitle), (e.PopupDesc = q.GetSaveWishlistDesc);
                      else return;
                  } else (e.showDenyButton = !0), (e.ButtonStyleString = ""), (e.PopupBodyStyleString = ""), (e.PopupTitle = q.GetTriggerPermissionTitle), (e.PopupDesc = q.GetTriggerPermissionDesc);
                  e = SwymUtils.renderTemplate(M.TriggerPermissionDialog, e);
                  l.instrument(l.Instrumentations.TriggerPermissionDialogOpened);
                  l.triggerSwymEvent(l.JSEvents.triggerPermissionDialogOpened);
                  b
                      ? ((b.innerHTML = e), c(b))
                      : r(e, "swym-remind-me", !0, {
                            appendTo: "swym-plugin",
                            onRender: c,
                            onDismiss: function () {
                                if (!f) {
                                    l.instrument(l.Instrumentations.TriggerPermissionDialogClosed);
                                    var b = 3;
                                    l.storage.get("tpermts") && (b += 2 * b);
                                    l.storage.set("tpermts", Date.now() + 864e5 * b);
                                }
                                a();
                            },
                        });
              }
              function c(a, b, c, d) {
                  function e(a, h) {
                      function E() {
                          (n = document.querySelector("#swym-remind-me-add-to-mailing-list-input")) && N.AddToMailingListChecked && N.MailingListCheckInPopup && (n.checked = !0);
                      }
                      function k(d) {
                          function e() {
                              C && C.checked && (C.checked = !1);
                              C && (C.disabled = !0);
                          }
                          function m(a) {
                              for (var b = 0; b < h.variants.length; b++) {
                                  var c = h.variants[b];
                                  if (c.id == a) {
                                      z = c;
                                      break;
                                  }
                              }
                          }
                          function Q(a, b) {
                              var c = a.parentNode.querySelector(".swym-validation-error-msg");
                              c && c.parentNode.removeChild(c);
                              SwymUtils.addClass(a, "swym-validation-error-input");
                              c = SwymUtils.createElement('<span class="swym-validation-error-msg">' + b + "</span>");
                              a.insertAdjacentElement("afterend", c);
                          }
                          function p(a) {
                              SwymUtils.addClass(a, "swym-loader swym-loading");
                              a.disabled = !0;
                          }
                          function ca(a) {
                              Object.keys(K).forEach(function (b) {
                                  b == a
                                      ? (SwymUtils.showElem(K[b]),
                                        SwymUtils.removeClass(M[b], "non-active"),
                                        SwymUtils.forEachElement("." + b + "-status", function (a) {
                                            SwymUtils.showElem(a);
                                        }))
                                      : (SwymUtils.hideElem(K[b]),
                                        M[b] && SwymUtils.addClass(M[b], "non-active"),
                                        SwymUtils.forEachElement("." + b + "-status", function (a) {
                                            SwymUtils.hideElem(a);
                                        }));
                              });
                          }
                          function I(a, b, c, d, e, f, g) {
                              a && SwymUtils.removeSelectedElement(a);
                              a = "<p class='" + g + "-status'><span class='swym-success-msg'>" + d + "</span><span>" + e + "</span>";
                              f = SwymUtils.createElement(f ? a + ("<span id='swym-timer'>" + f + " minutes</span></p>") : a + "</p>");
                              b = document.querySelector(b);
                              b.querySelector("p span.swym-success-msg") || b.insertAdjacentElement(c, f);
                          }
                          function Yb(a, d, e) {
                              var f = d || f,
                                  g = document.getElementById("swym-remind-email-auth-input"),
                                  h;
                              N.MailingListCheckInPopup && (h = document.getElementById("swym-remind-me-add-to-mailing-list-input"));
                              l.api.sendWatchlist(
                                  a || (g && g.value),
                                  "email",
                                  b,
                                  function (a) {
                                      SwymUtils.removeClass(f, "swym-loading");
                                      f.disabled = !1;
                                      var b = "";
                                      a.message && (b = a.message);
                                      a.error
                                          ? (b || (b = q.ISAMsgDefaultError), da("error", b), c && c(!1))
                                          : (I(".swym-remind-email-container", ".swym-mediums-switcher", "afterend", q.EmailSentMsg, q.EmailSuccessMsg, null, "email"),
                                            g && l.storage.set(l.key.WEML, g.value),
                                            e && SwymUtils.hideElem(f),
                                            c && c(!0));
                                  },
                                  function (a, b) {
                                      setTimeout(function () {
                                          SwymUtils.removeClass(f, "swym-loading");
                                          f.disabled = !1;
                                          Q(g, q.ISAMsgDefaultError);
                                          c && c(!1);
                                      }, 500);
                                  },
                                  h ? (h.checked ? 1 : 0) : 0
                              );
                          }
                          function t() {
                              var a = document.getElementById("swym-remind-email-auth-input").value;
                              SwymUtils.isValidUserInput("validateEmail", a) ? (fa(v, ".swym-remind-email-container"), SwymUtils.addClass(D, "swym-loader swym-loading"), (D.disabled = !0), Yb(a, D, !0)) : Q(v, q.MsgInvalidEmail);
                          }
                          function fa(a, b) {
                              SwymUtils.removeClass(a, "swym-validation-error-input");
                              SwymUtils.removeSelectedElement(b + " .swym-input-and-error-container .swym-validation-error-msg");
                          }
                          function r(a, b) {
                              function c() {
                                  l.swymApi({
                                      endpoint: "/user-preference",
                                      callbackFn: function (a) {
                                          if (a && a.Mediums) {
                                              a = a.Mediums.sms ? a.Mediums.sms.values || [] : [];
                                              var b = document.getElementById("swym-remind-sms-input").value;
                                              -1 < a.indexOf(b) &&
                                                  ((a = SwymUtils.createElement("<span class='swym-verified-tick'>\u2713</span>")),
                                                  (b = document.querySelector("#swym-remind-sms-input")),
                                                  (b.style.paddingLeft = "32px"),
                                                  (document.querySelector(".swym-remind-sms-container .swym-input-and-error-container").style.position = "relative"),
                                                  b.insertAdjacentElement("afterend", a));
                                          }
                                      },
                                      v3: !0,
                                  });
                              }
                              var d = a,
                                  e,
                                  f;
                              if (b)
                                  var g = setInterval(function () {
                                      e = parseInt(d / 60, 10);
                                      f = parseInt(d % 60, 10);
                                      e = 10 > e ? "0" + e : e;
                                      f = 10 > f ? "0" + f : f;
                                      b.textContent = e + ":" + f;
                                      0 > --d && (clearInterval(g), (A.disabled = !1), SwymUtils.removeClass(A, "swym-loader swym-loading"), (A.innerText = q.ResendSMS), c());
                                  }, 1e3);
                          }
                          function Va() {
                              var a = document.getElementById("swym-remind-sms-input").value;
                              l.mediumValidate(
                                  "backinstock",
                                  b,
                                  "sms",
                                  "+1" + a,
                                  function (a) {
                                      if (a && 1 == a.status)
                                          I(null, ".swym-remind-sms-container .swym-input-and-error-container", "beforeend", q.SMSSentMsg, q.SMSNotReceiveMsg, "02:00", "sms"), r(120, document.querySelector("#swym-timer"));
                                      else {
                                          var b = { "invalid-mediumvalue": q.MsgInvalidContactNo, "server-error": q.ServerError, "store-quota-exceeded": q.StoreQuotaExceed, "maximum-retry-exceeded": q.MaxRetryReached };
                                          a &&
                                              0 == a.status &&
                                              ("maximum-retry-exceeded" == a.error ? Q(H, b[a.error] + a["error-data"]["next-retry"] + " hours") : Q(H, b[a.error]), (A.disabled = !1), SwymUtils.removeClass(A, "swym-loader swym-loading"));
                                      }
                                  },
                                  function () {
                                      Q(H, q.ISAMsgDefaultError);
                                      A.disabled = !1;
                                      SwymUtils.removeClass(A, "swym-loader swym-loading");
                                  }
                              );
                          }
                          function u() {
                              var a = document.getElementById("swym-remind-sms-input").value;
                              SwymUtils.isValidUserInput("validatePhoneNumber", a) ? (fa(H, ".swym-remind-sms-container"), (A.disabled = !0), Va()) : Q(H, q.MsgInvalidContactNo);
                          }
                          function w() {
                              var a = [],
                                  c,
                                  d = function () {
                                      l.storage.set("webpushObj", c);
                                  },
                                  e = function () {};
                              l.api.getWebPushSubscription(function (f) {
                                  f && (a.push({ medium: "webpush", mediumvalue: f.mediumvalue }), (c = f), l.sendWatchlistV3(a, b, d, e, C ? (C.checked ? 1 : 0) : 0));
                              });
                          }
                          function y(a, d, e, h) {
                              var E = document.getElementById("swym-remind-email-auth-input"),
                                  k = document.getElementById("swym-remind-email-auth-button") || document.querySelector(".swym-common-sub-button"),
                                  m,
                                  Q,
                                  p;
                              N.MailingListCheckInPopup && (m = document.getElementById("swym-remind-me-add-to-mailing-list-input"));
                              g && (Q = document.getElementById("swym-remind-me-webpush-input"));
                              f && (p = document.getElementById("swym-remind-sms-input"));
                              var ca = function (b) {
                                      setTimeout(function () {
                                          SwymUtils.removeClass(k, "swym-loading");
                                          k.disabled = !1;
                                          var d = "";
                                          b.message && (d = b.message);
                                          if (b.error) d || (d = q.ISAMsgDefaultError), da("error", d), c && c(!1);
                                          else {
                                              var d = q.ISAMsgDefaultSuccess,
                                                  e = document.querySelector(".swym-remind-auth-form-container");
                                              l.storage.get(l.key.WEML) || l.storage.set(l.key.WEML, a || (E && E.value));
                                              e ? (e.parentNode.removeChild(e), da("success", d)) : h();
                                              c && c(!0);
                                          }
                                      }, 500);
                                  },
                                  n = function (a, b) {
                                      setTimeout(function () {
                                          SwymUtils.removeClass(k, "swym-loading");
                                          k.disabled = !1;
                                          var a = b.responseBody;
                                          a || (a = q.ISAMsgDefaultError);
                                          da("error", a);
                                          c && c(!1);
                                      }, 500);
                                  },
                                  I = [];
                              (a || (E && E.value)) && I.push({ medium: "email", mediumvalue: a || E.value });
                              (d || (p && p.value)) && I.push({ medium: "sms", mediumvalue: d || p.value.split(" ")[0] });
                              e || (Q && Q.checked)
                                  ? l.api.getWebPushSubscription(function (a) {
                                        a
                                            ? (l.storage.get("webpushObj") || l.storage.set("webpushObj", a), I.push({ medium: "webpush", mediumvalue: a.mediumvalue }), l.sendWatchlistV3(I, b, ca, n, m ? (m.checked ? 1 : 0) : 0))
                                            : (da("error", q.AllowPushNotifications), SwymUtils.removeClass(k, "swym-loading"));
                                    })
                                  : d || (p && p.value)
                                  ? l.sendWatchlistV3(I, b, ca, n, m ? (m.checked ? 1 : 0) : 0)
                                  : l.api.sendWatchlist(a || (E && E.value), "email", b, ca, n, m ? (m.checked ? 1 : 0) : 0);
                          }
                          function da(a, b) {
                              document.getElementById("swym-remind-email-auth-message").innerHTML = SwymUtils.renderTemplateString('<span class="swym-{{type}}">{{message}}</span>', { type: a, message: b });
                          }
                          E();
                          var v = document.getElementById("swym-remind-email-auth-input");
                          (d = l.getSwymEmail() || l.storage.get(l.key.WEML)) && v && (v.value = d);
                          var z;
                          (d = document.getElementById("swym-remind-auth-form")) &&
                              SwymUtils.addEvent(d, "submit", function (a) {
                                  a.preventDefault();
                                  document.getElementById("swym-remind-email-auth-button").click();
                              });
                          var C = document.getElementById("swym-remind-me-add-to-mailing-list-input");
                          v && !v.value && e();
                          v &&
                              (v.onchange = function () {
                                  v.value ? (C && C.disabled && (C.disabled = !1), E()) : e();
                                  n && N.AddToMailingListChecked && N.MailingListCheckInPopup && (n.checked = !0);
                              });
                          if (a.product.empi != l.getCurrentPageData().empi || N.VariantSelectorInPopup)
                              if ((d = document.getElementById("swym-remind-me-oos-options"))) {
                                  d.onchange = function (a) {
                                      a = parseInt(this.value);
                                      m(a);
                                  };
                                  if (l.platform.isVariantInProductOutOfStock(b.epi, h)) m(b.epi), (d.value = b.epi);
                                  else {
                                      var B = h.oosOptions[0].id;
                                      d.value = B;
                                      m(B);
                                  }
                                  if ("" === d.value || null === d.value) d.value = h.oosOptions[0].id;
                              } else m(b.epi);
                          if (f)
                              var D = document.querySelector(".email-sub-button"),
                                  A = document.querySelector(".sms-sub-button"),
                                  F = document.querySelector(".webpush-sub-button"),
                                  G = document.querySelector(".swym-common-sub-button"),
                                  H = document.getElementById("swym-remind-sms-input");
                          d = document.querySelector(".swym-mediums-switcher #email-switch");
                          var B = document.querySelector(".swym-mediums-switcher #sms-switch"),
                              J = document.querySelector(".swym-mediums-switcher #webpush-switch"),
                              L = document.querySelector(".swym-remind-email-container"),
                              O = document.querySelector(".swym-remind-sms-container"),
                              P = document.querySelector(".swym-remind-me-mailing-list-container.swym-webpush"),
                              K = { email: L, sms: O, webpush: P },
                              M = { email: d, sms: B, webpush: J };
                          d &&
                              (d.onclick = function () {
                                  ca("email");
                              });
                          B &&
                              (B.onclick = function () {
                                  ca("sms");
                              });
                          J &&
                              (J.onclick = function () {
                                  ca("webpush");
                              });
                          D && (D.onclick = t);
                          A && (A.onclick = u);
                          F && (F.onclick = w);
                          G &&
                              (G.onclick = function () {
                                  p(G);
                                  var a = l.getSwymEmail() || l.storage.get(l.key.WEML),
                                      b = l.storage.get("validatedUserContactNo"),
                                      c;
                                  b && (c = b[b.length - 1]);
                                  b = l.storage.get("webpushObj");
                                  y(a, c, b, function () {
                                      I(".swym-remind-auth", ".swym-information", "beforeend", q.SubscribeSuccessInfo, q.SubscribeSuccessStr, null, "webpush");
                                  });
                              });
                          (F = document.getElementById("swym-remind-email-auth-button")) &&
                              SwymUtils.addEvent(F, "click", function (a) {
                                  a = document.getElementById("swym-remind-email-auth-input");
                                  var c = document.getElementById("swym-remind-email-auth-button"),
                                      d = document.getElementById("swym-remind-email-auth-message"),
                                      e,
                                      E;
                                  N.MailingListCheckInPopup && document.getElementById("swym-remind-me-add-to-mailing-list-input");
                                  g && (e = document.getElementById("swym-remind-me-webpush-input"));
                                  f && (E = document.getElementById("swym-remind-sms-input"));
                                  if (b.empi != l.getCurrentPageData().empi || N.VariantSelectorInPopup) {
                                      var k;
                                      var m = z;
                                      k = document.getElementById("swym-remind-email-auth-message");
                                      m = m && l.platform.isVariantOOS(m, h) ? "oos" : "is";
                                      "oos" == m
                                          ? (document.getElementById("swym-remind-email-auth-button").removeAttribute("disabled"), (k.innerHTML = ""), (k = !0))
                                          : "is" == m
                                          ? (document.getElementById("swym-remind-email-auth-button").setAttribute("disabled", !0), da("info", q.MsgVariantInStock), (k = !1))
                                          : (k = void 0);
                                      if (!k) return;
                                      b.epi = z.id;
                                      b.pr = z.price;
                                      b.variants = [{}];
                                      b.variants[0][z.title] = String(z.id);
                                      b.uri = b.du + "?variant=" + z.id;
                                  }
                                  if (a.value || f || g) {
                                      k = { email: a.value };
                                      f && (k.sms = E.value);
                                      g && (k.webpush = e.checked);
                                      e = !0;
                                      for (var m = Object.keys(k), Q = 0, Xb = m.length; Q < Xb; Q++)
                                          if (k[m[Q]]) {
                                              e = !1;
                                              break;
                                          }
                                      if (e) da("error", q.AtLeastOneRequired);
                                      else if (a.value && !SwymUtils.validateEmail(a.value)) da("error", q.MsgInvalidEmail);
                                      else if (E && E.value && !SwymUtils.validatePhoneNumber(E.value.split(" ")[0])) da("error", q.MsgInvalidContactNo);
                                      else {
                                          if (E && E.value) {
                                              if (-1 === (l.storage.get("validatedUserContactNo") || []).indexOf(E.value.split(" ")[0])) {
                                                  da("error", q.ContactNoValidationNeeded);
                                                  return;
                                              }
                                          } else d.innerHTML = "";
                                          SwymUtils.addClass(c, "swym-loading");
                                          c.disabled = !0;
                                          y();
                                      }
                                  } else da("error", q.MsgInvalidEmail);
                              });
                      }
                      var m;
                      if (N.SMSEnabled || N.WebpushEnabled) {
                          a.message = q.ISARemindMeBlockDesc;
                          m = l.storage.get(l.key.WEML);
                          var p = l.storage.get("validatedUserContactNo"),
                              ca = l.storage.get("webpushObj");
                          (ca = m || p || ca) && !l.storage.get("isaPopupShown") && l.storage.set("isaPopupShown", !0);
                          a.EmailMeCTA = q.EmailMeCTA;
                          a.SMSCTA = q.SMSCTA;
                          a.WebpushCTA = q.WebpushCTA;
                          a.showWebpushCheckbox = N.WebpushEnabled;
                          if (ca)
                              (a.showEmailContainer = !1), (a.showSMSContainer = !1), (a.showWebpushCheckbox = !1), (a.showCommonSubscribeBtn = !0), (a.showSavedMediums = !0), m && (a.emailAddr = m), p && (a.contactNo = p[p.length - 1]);
                          else {
                              a.showEmailContainer = !0;
                              if (N.SMSEnabled || N.WebpushEnabled) (a.showMediumsSwitcher = !0), (a.EmailSwitchLabel = q.EmailSwitchLabel), (a.SMSSwitchLabel = q.SMSSwitchLabel), (a.WebpushSwitchLabel = q.WebpushSwitchLabel);
                              N.SMSEnabled && (a.showSMSContainer = !0);
                              N.WebpushEnabled && (a.showWebpushCheckbox = !0);
                          }
                          m = SwymUtils.renderTemplate(M.RemindMeBlock, a);
                      } else m = SwymUtils.renderTemplate(M.WatchlistPopup, a);
                      l.instrument(l.Instrumentations.WatchlistOpened);
                      l.triggerSwymEvent(l.JSEvents.watchlistPopupOpened);
                      var n = document.querySelector("#swym-remind-me-add-to-mailing-list-input");
                      d ? ((d.innerHTML = m), k(d)) : r(m, "swym-remind-me", !0, { appendTo: "swym-plugin", onRender: k, onDismiss: function () {} });
                  }
                  var f = l.retailerSettings.Watchlist.SMSEnabled,
                      g = l.retailerSettings.Watchlist.WebpushEnabled,
                      h = { message: N.OnlyStock ? q.ISABISOnlyDesc : q.ISAAllDesc, title: N.CTA, product: ha(b) };
                  N.MailingListCheckInPopup && ((h.showMailingListCheckbox = !0), (h.addToMailingListText = N.addToMailingListText || q.ISAAddToMailingList));
                  g && ((h.showWebpushCheckbox = !0), (h.subscribeToPushText = l.retailerSettings.Watchlist.WebpushText || q.ISASubscribeWebpush));
                  f &&
                      ((a = l.storage.get("validatedUserContactNo") || []),
                      a.length && (h.contactNo = a[a.length - 1]),
                      (h.showSMSInput = !0),
                      (h.contactNoPlaceHolder = q.EnterContactPlaceholder),
                      (h.contactNoActionString = q.SendOTPButton),
                      (h.ISASMSDesc = q.ISASMSDesc));
                  b.empi != l.getCurrentPageData().empi || N.VariantSelectorInPopup
                      ? l.api.getProductDetails(b, function (a) {
                            h.showVariantSelector = !0;
                            for (var b = [], c = 0; c < a.variants.length; c++) {
                                var d = a.variants[c],
                                    f = d.options.join(" / ");
                                l.platform.isVariantOOS(d, a) && "Default Title" !== f && "" !== f && b.push({ variantString: f, id: d.id });
                            }
                            a.oosOptions = b;
                            h.oosOptions = a.oosOptions;
                            0 == h.oosOptions.length && (h.showVariantSelector = !1);
                            G(a);
                            a.variants.forEach(ka);
                            e(h, a);
                        })
                      : e(h);
              }
              function d() {
                  function a() {
                      function c() {
                          +new Date() - d > b.CheckConditions.PopupInterval.Timems && b.CheckConditions.ShowTillAccept && (!e || (e && (!e.SendEmail || (e.SendEmail && !e.SendEmail.enabled)))) && l.storage.set("uprefask", !0);
                      }
                      var d = l.storage.get("gdprShownTs"),
                          e = l.storage.get("u_pref");
                      if (b) {
                          l.authCheck();
                          var f = l.storage.get("uprefask"),
                              g = b.CheckConditions.WishlistedItemCount;
                          if (g.Enabled) {
                              var h = g.Count;
                              l.fetch(function (a) {
                                  a.length >= h && (f || d ? !f && d && c() : l.storage.set("uprefask", !0));
                              });
                          }
                          g = b.CheckConditions.TimeSpentOnSite;
                          if (g.Enabled) {
                              var E = l.storage.get("sessionTimeSeconds");
                              (function () {
                                  var a = +new Date();
                                  window.onbeforeunload = function () {
                                      var b = (+new Date() - a) / 1e3;
                                      E ? l.storage.set("sessionTimeSeconds", E + b) : l.storage.set("sessionTimeSeconds", b);
                                  };
                              })();
                              E >= g.Timems / 1e3 && (f || d ? !f && d && c() : l.storage.set("uprefask", !0));
                          }
                      }
                  }
                  if (!document.getElementById("swym-plugin")) return SwymUtils.warn("#swym-plugin cannot be found"), !1;
                  l = window._swat;
                  if (!l) return (document.getElementById("swym-plugin").style.display = "none"), console.error("Unable to find window.swat"), !1;
                  var b = l.retailerSettings.Wishlist.WishlistReminderPopup,
                      c = l.retailerSettings.TriggeredMessaging;
                  if (c && c.Enabled) {
                      var d = function () {
                              l.swymApi({
                                  endpoint: "/user-preference",
                                  callbackFn: function (a) {
                                      var b = !1;
                                      if (a && a.Mediums && a.clusterid) {
                                          var c = Object.keys(a.Mediums);
                                          if (c.length)
                                              for (var d = 0, f = c.length; d < f; d += 1)
                                                  if (a.Mediums[c[d]].acceptmarketing) {
                                                      b = !0;
                                                      l.storage.set("acceptmarketing", { accepted: !0, timeStamp: e() });
                                                      break;
                                                  }
                                      }
                                      a && a.clusterid && !b && (l.storage.set("acceptmarketing", { accepted: !1, timeStamp: e() }), v());
                                  },
                                  v3: !0,
                              });
                          },
                          e = function () {
                              var a = new Date();
                              a.setTime(a.getTime() + 864e5);
                              return +a;
                          },
                          g = function () {
                              var a = +new Date(),
                                  b = l.storage.get("sessionTimeSeconds");
                              b > 60 * (fa.timeSpentMins || 30) && t();
                              window.onbeforeunload = function () {
                                  var c = (+new Date() - a) / 1e3;
                                  b ? l.storage.set("sessionTimeSeconds", b + c) : l.storage.set("sessionTimeSeconds", c);
                              };
                          },
                          m = function () {
                              l.fetch(function (a) {
                                  for (var b = 0, c = a.length; b < c; b += 1) {
                                      var d = a[b];
                                      if (Math.floor(+new Date() - d.ts) / 1e3 / 60 > (fa.addToCartWaitTimeMins || 5) && d.et === l.EventTypes.addToCart) {
                                          var e = d.epi,
                                              f = d.empi;
                                          if (
                                              0 <
                                              a.filter(function (a) {
                                                  return a.epi === e && a.empi === f && a.et === l.EventTypes.checkout;
                                              }).length
                                          ) {
                                              t();
                                              break;
                                          }
                                      }
                                  }
                              });
                          },
                          p = function () {
                              l.fetch(function (a) {
                                  var b = 0;
                                  a.forEach(function (a) {
                                      Math.floor(+new Date() - a.ts) / 1e3 / 60 / 60 / 24 < ((fa.productsViewed && fa.productsViewed.daysLimit) || 30) && (a.et === l.EventTypes.productView || a.et === l.EventTypes.addToWishlist) && b++;
                                  });
                                  b > ((fa.productsViewed && fa.productsViewed.numberOfProducts) || 5) && t();
                              });
                          },
                          n = function () {
                              l.evtLayer.addEventListener(l.JSEvents.addedToWishlist, function () {
                                  t();
                              });
                          },
                          t = function (a) {
                              setTimeout(function () {
                                  if (!l.storage.get("optinShownBefore")) {
                                      var a = SwymUtils.renderTemplate(M.TriggeredMessagingOptinForm, { OptinFormTitle: q.OptInHeading, OptinFormDesc: q.OptInDescription, showSMSOptIn: c.SMS, StoreLogo: l.retailerSettings.StoreLogo });
                                      r(a, "swym-remind-me", !0, {
                                          onRender: function () {
                                              document.querySelector(".swym-tab-modal-content").className += " noPadding";
                                              var a = "email",
                                                  b,
                                                  d;
                                              l.authCheck(function (b) {
                                                  b.email && (d = b.email) && "email" === a && ((document.querySelector(".swymPopupInputs input").value = d), (document.querySelector(".swymPopupInputs input").disabled = !0));
                                              });
                                              var f = function () {
                                                  for (var a = document.querySelector(".swymPopupStatusMsg"); a.firstChild; ) a.removeChild(a.firstChild);
                                              };
                                              document.querySelector(".swymPopupInputs button.swymSubButton").onclick = function () {
                                                  function c(a, b, g) {
                                                      l.swymApiPost({
                                                          endpoint: "/user-preference",
                                                          params: { email: g && g.noEmailVal ? null : d || a, prefmap: b },
                                                          callbackFn: function () {
                                                              l.storage.set("acceptmarketing", { accepted: !0, timeStamp: e() });
                                                              f();
                                                              document.querySelector(".swymPopupStatusMsg").insertAdjacentHTML("afterbegin", "<span class='swym-success'>" + q.SubscribeSuccess + "</span>");
                                                              document.querySelector(".swymPopupInputs input").disabled = !0;
                                                              document.querySelector(".swymPopupInputs button.swymSubButton").disabled = !0;
                                                              document.querySelector(".swymPopupFooter a.swymTMMediumSwitch").onclick = null;
                                                              l.instrument(l.Instrumentations.OptInFormSubscribed);
                                                          },
                                                          v3: !0,
                                                          sendSessionId: !1,
                                                      });
                                                  }
                                                  var g = document.querySelector(".swymPopupInputs input").value,
                                                      h = function (a) {
                                                          f();
                                                          document.querySelector(".swymPopupStatusMsg").insertAdjacentHTML("afterbegin", "<span class='swym-error'>" + (a || q.DataErrorMsg) + "</span>");
                                                      };
                                                  if ("email" === a ? SwymUtils.validateEmail(g) : SwymUtils.validatePhoneNumber(g))
                                                      if ("sms" === a)
                                                          (b = g),
                                                              l.swymApiPost({
                                                                  endpoint: "/send-otp",
                                                                  params: { mediumvalue: g, medium: "sms", regid: l.storage.get("swymRegid") },
                                                                  callbackFn: function (a) {
                                                                      1 === a.status
                                                                          ? (f(),
                                                                            (document.querySelector(".swymPopupInputs input").value = ""),
                                                                            (document.querySelector(".swymPopupInputs input").placeholder = q.EnterOTP),
                                                                            (document.querySelector(".swymPopupInputs").style.width = "50%"),
                                                                            (document.querySelector(".swymPopupInputs button.swymSubButton").innerText = q.SubscribeButton),
                                                                            (document.querySelector(".swymPopupInputs button.swymSubButton").onclick = function () {
                                                                                var a = document.querySelector(".swymPopupInputs input").value;
                                                                                SwymUtils.validateOTP(a)
                                                                                    ? l.swymApiPost({
                                                                                          endpoint: "/validate-otp",
                                                                                          params: { otpcode: a, mediumvalue: b, medium: "sms", regid: l.storage.get("swymRegid") },
                                                                                          callbackFn: function (b) {
                                                                                              1 === b.status
                                                                                                  ? c(a, { Mediums: { sms: { acceptmarketing: !0, acceptsource: "client" } } }, { noEmailVal: !0 })
                                                                                                  : h(
                                                                                                        "store-quota-exceeded" === b.error
                                                                                                            ? q.ServiceUnavailable
                                                                                                            : "invalid" === b.error
                                                                                                            ? q.InvalidOTP
                                                                                                            : q.MaxRetryReached + " " + b["error-data"]["next-retry"] + " hours"
                                                                                                    );
                                                                                          },
                                                                                          v3: !0,
                                                                                          sendSessionId: !1,
                                                                                      })
                                                                                    : h();
                                                                            }))
                                                                          : h(a.error);
                                                                  },
                                                                  v3: !0,
                                                                  sendSessionId: !1,
                                                              });
                                                      else {
                                                          var E = { Mediums: {} };
                                                          "email" === a
                                                              ? (E.Mediums.email = { acceptmarketing: !0, acceptsource: "client", value: d || g })
                                                              : "sms" === a && (E.Mediums.sms = { acceptmarketing: !0, acceptsource: "client", value: g });
                                                          c(g, E);
                                                      }
                                                  else h();
                                              };
                                              c.SMS &&
                                                  (document.querySelector(".swymPopupFooter a.swymTMMediumSwitch").onclick = function () {
                                                      f();
                                                      "email" === a
                                                          ? ((a = "sms"),
                                                            (document.querySelector(".swymPopupInputs input").placeholder = q.PhoneNoInputPlaceholder),
                                                            (document.querySelector(".swymPopupInputs input").value = ""),
                                                            (document.querySelector(".swymPopupInputs input").disabled = !1),
                                                            (document.querySelector(".swymPopupInputs button.swymSubButton").innerText = q.SendOTPButton),
                                                            (document.querySelector(".swymPopupFooter a.swymTMMediumSwitch").innerText = q.OptInForEmail),
                                                            f(),
                                                            document.querySelector(".swymPopupStatusMsg").insertAdjacentHTML("afterbegin", "<span class='swym-warning'>" + q.OTPWarningMsg + "</span>"))
                                                          : ((a = "email"),
                                                            (document.querySelector(".swymPopupInputs input").value = ""),
                                                            d && ((document.querySelector(".swymPopupInputs input").value = d), (document.querySelector(".swymPopupInputs input").disabled = !0)),
                                                            (document.querySelector(".swymPopupInputs input").placeholder = q.EmailInputPlaceHolder),
                                                            (document.querySelector(".swymPopupInputs button.swymSubButton").innerText = q.SubscribeButton),
                                                            (document.querySelector(".swymPopupFooter a.swymTMMediumSwitch").innerText = q.OptInForSMS));
                                                  });
                                          },
                                          appendTo: "swym-plugin",
                                          onDismiss: function () {
                                              l.instrument(l.Instrumentations.OptInFormClosed);
                                              l.storage.set("optInFormClosedOnTs", +new Date());
                                          },
                                      });
                                      l.storage.set("optinShownBefore", !0);
                                      l.instrument(l.Instrumentations.OptInFormOpened);
                                  }
                              }, a || fa.popupWaitTimeMs || 2e3);
                          },
                          v = function () {
                              var a = l.storage.get("optInFormClosedOnTs"),
                                  b = null;
                              a && (b = (+new Date() - a) / 1e3 / 60 / 60 / 24 > (c.OptInFormInterval || 7));
                              if (!a || b) n(), p(), m(), g();
                          },
                          fa = c.OptinFormCheckConditions || {},
                          u = l.storage.get("acceptmarketing"),
                          Va = +new Date();
                      u ? (u.timeStamp < Va ? d() : u.accepted || v()) : d();
                  }
                  M = l.retailerSettings.Templates;
                  q = l.retailerSettings.Strings;
                  pa = l.retailerSettings.General;
                  Z = l.retailerSettings.Wishlist;
                  N = l.retailerSettings.Watchlist;
                  J = l.retailerSettings.UI;
                  SwymUtils.onDOMReady(function () {
                      l.evtLayer.addEventListener(f.JSEvents.regidRefreshed, function (a) {
                          SwymUtils.hasClass(document.getElementById("swym-plugin"), "show-notepad")
                              ? l.ui.refreshProducts()
                              : a.detail.d.disconnect
                              ? l.ui.refreshProducts()
                              : l.api.fetch(function (a) {
                                    SwymUtils.hasClass(document.getElementById("swym-plugin"), "show-notepad") && B();
                                }, "relay");
                      });
                      if (l.retailerSettings.UI.GridPagedRender) {
                          var a = [];
                          l.evtLayer.addEventListener(f.JSEvents.productInvalidOnLoad, function (b) {
                              b = b.detail.d.product;
                              a.push("swtmp_" + b.et + "_" + b.epi);
                          });
                          l.evtLayer.addEventListener(f.JSEvents.renderProducts, function (b) {
                              a.forEach(function (a) {
                                  (a = document.getElementById(a)) && a.parentNode && a.parentNode.removeChild(a);
                              });
                          });
                      }
                  });
                  SwymUtils.isTouchDevice() || SwymUtils.addClass(document.getElementsByTagName("body")[0], "swym-no-touch");
                  l.setNotificationUX(h);
                  F();
                  SwymUtils.addEvent(document.querySelector("#swym-plugin #notepad-anchor-title"), "click", function (a) {
                      a.preventDefault();
                      l.ui.open();
                  });
                  Ha = SwymUtils.debounce(va, 100);
                  l.triggerSwymEvent(l.JSEvents.readyRelayUI);
                  l.deviceCache.makeCacheEntryStale();
                  l.isSimpleWishlistOnly() &&
                      (SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                          SwymUtils.addClass(a, "show-simple-wishlist");
                      }),
                      (d = document.querySelector("#swym-item-actions li.email")),
                      document.querySelector(".swym-tabs-nav").insertBefore(d, document.querySelector(".swym-tabs-nav li:last-child")),
                      (d = document.getElementById("swym-email-container")),
                      d.parentNode.parentNode.appendChild(d),
                      Fa(l.EventTypes.addToWishlist));
                  l.isCollectionsEnabled() &&
                      SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                          SwymUtils.addClass(a, "show-wishlist-hashtags");
                      });
                  "floating" == J.LauncherType &&
                      (Z.ShowBadge &&
                          ((d = document.getElementById("swym-anchor")),
                          (u = document.createElement("DIV")),
                          (u.innerHTML = SwymUtils.renderTemplateString('<span class="swym-anchor-badge"></span>', {})),
                          d.appendChild(u.firstChild),
                          l.renderWishlistCount(d.querySelector(".swym-anchor-badge"), function (a, b) {}, Z.ShowAddAnimation ? 1500 : 0)),
                      Z.ShowAddAnimation &&
                          (SwymUI.prototype.showWishlistAnimation = function (a) {
                              a = SwymUtils.elemPosition(a);
                              var b = document.createElement("div");
                              b.innerHTML = SwymUtils.renderTemplateString('<button class="swym-button swym-add-to-wishlist-view-product swym-icon swym-{{ButtonIcon}} swym-loaded swym-added swym-wishlist-animate"></button>', {
                                  ButtonIcon: Z.ButtonIcon,
                              });
                              var c = b.firstChild;
                              c.style.msTransform = c.style.mozTransform = c.style.webkitTransform = c.style.transform = "translate(" + a.left + "px, " + a.top + "px)";
                              document.body.appendChild(c);
                              setTimeout(function () {
                                  var a = document.querySelector("#swym-anchor i.swym-icon"),
                                      a = SwymUtils.elemPosition(a);
                                  c.style.msTransform = c.style.mozTransform = c.style.webkitTransform = c.style.transform = "translate(" + a.left + "px, " + a.top + "px) scale(2)";
                                  var a = SwymUtils.whichTransitionEvent(),
                                      b = SwymUtils.whichAnimationEvent();
                                  SwymUtils.addEvent(
                                      c,
                                      a,
                                      function (a) {
                                          SwymUtils.addClass(c, "swym-wishlist-animate-end");
                                      },
                                      !1
                                  );
                                  SwymUtils.addEvent(
                                      c,
                                      b,
                                      function (a) {
                                          c.parentNode.removeChild(c);
                                      },
                                      !1
                                  );
                              }, 50);
                          }));
                  b && a();
              }
              function e(a) {
                  if (!SwymUtils.hasClass(document.getElementById("swym-plugin"), "show-notepad")) {
                      a = a || {};
                      var b = a.originInstrument,
                          c = a.tab;
                      a.filter && Fa(et);
                      if (SwymUtils.onHostedUI())
                          var d = SwymUtils.getEncodedAsObject(window.location.search),
                              b = d.fromNotification ? l.Instrumentations.UIOpenFromNotification : d.originInstrument,
                              d = d.epi;
                      else if ("hosted" == J.LauncherOpenHosted) {
                          qa(l.storage.get("currentFilter"), c);
                          a = document.getElementById("swym-notification");
                          d = a.getAttribute("data-epi");
                          window.location = SwymUtils.getHostedURL() + (-1 < SwymUtils.getHostedURL().indexOf("?") ? "&" : "?") + (SwymUtils.isUndefined(b) ? "" : "originInstrument=" + b) + (d ? "&epi=" + d : "");
                          return;
                      }
                      var b = b || l.Instrumentations.UIOpenFromAnchor,
                          e = b == l.Instrumentations.UIOpenFromNotification;
                      e ? ((a = document.getElementById("swym-notification")), l.instrument(b, m(d || a.getAttribute("data-epi"), a.getAttribute("data-nt")))) : l.instrument(b);
                      l.triggerSwymEvent(l.JSEvents.relayOpened, { fromNotification: e, originInstrument: b });
                      SwymUtils.addClass(document.getElementsByTagName("body")[0], "swym-no-scroll");
                      SwymUtils.addClass(document.getElementById("swym-plugin"), "show-notepad");
                      B(c);
                      Ha();
                      SwymUtils.addEvent(window, "resize", Ha);
                      c && u(c);
                  }
              }
              function g(a) {
                  l.instrument(l.Instrumentations.UIClose);
                  SwymUtils.removeClass(document.getElementsByTagName("body")[0], "swym-no-scroll");
                  SwymUtils.removeClass(document.getElementById("swym-plugin"), "show-notepad");
                  SwymUtils.removeEvent(window, "resize", Ha);
                  a || w();
              }
              function h(a, b) {
                  var c = "" + a.nt,
                      d;
                  SwymUtils.notifyVibrate();
                  if (b) {
                      d = b.epi;
                      a && U(a, b, d);
                      var e = document.getElementById("swym-plugin");
                      SwymUtils.addClass(e, "show-notification");
                      SwymUtils.addClass(e, "swym-nt-" + a.nt);
                      Ia = a;
                      e = document.getElementById("swym-notification");
                      clearTimeout(wa);
                      wa = setTimeout(function () {
                          p();
                      }, 8e3);
                      SwymUtils.addEvent(e.firstChild, "mouseenter", function () {
                          window.clearTimeout(wa);
                      });
                      SwymUtils.addEvent(e.firstChild, "mouseleave", function () {
                          SwymUtils.hasClass(this, "expanded") ||
                              (wa = setTimeout(function () {
                                  p();
                              }, 8e3));
                      });
                      l.instrument(l.Instrumentations.NotificationShown, m(d, c));
                  } else (d = "swym#" + a.nt), n(a, b);
              }
              function m(a, b) {
                  return { epi: a, nt: (-1 < (b + "").indexOf("swym#") ? "" : "swym#") + b };
              }
              function p(a) {
                  SwymUtils.removeClass(document.getElementById("swym-plugin"), "show-notification");
                  SwymUtils.removeClass(document.getElementById("swym-notification"), "expanded");
                  if (!a && window.event && SwymUtils.hasClass(window.event.currentTarget, "swym-close")) {
                      var b = document.getElementById("swym-notification");
                      a = b.getAttribute("data-nt");
                      b = b.getAttribute("data-epi");
                      l.instrument(l.Instrumentations.DismissNotification, m(b, a));
                  }
                  clearTimeout(wa);
              }
              function n(a, b) {
                  var c = a.nt,
                      d;
                  d = b ? b.epi : "swym#" + a.nt;
                  var e = b || {};
                  e.dt && (e.dt = ia(e.dt));
                  for (var f in a) e[f] = a[f];
                  e.du || (e.du = "javascript:void(0);");
                  e.dt || (e.dt = a.msg);
                  !e.iu && a.img && (e.iu = a.img);
                  SwymUtils.isUndefined(e.et) && (e.et = "-");
                  e = SwymUtils.formatProductPrice(e);
                  f = document.getElementById("swym-santa");
                  e = SwymUtils.renderTemplate(M.Santa, e);
                  f.innerHTML = e;
                  e = document.getElementById("swym-plugin");
                  SwymUtils.addClass(e, "swym-nt-" + a.nt);
                  Ia = a;
                  SwymUtils.removeClass(f, "swym-hide");
                  SwymUtils.addClass(f, "swym-show");
                  [document.getElementById("swym-notification"), f].forEach(function (b) {
                      b.setAttribute("data-tab-et", a.tabEt ? a.tabEt : "");
                      b.setAttribute("data-tab", a.tab ? a.tab : "");
                      b.setAttribute("data-nt", a.nt);
                      b.setAttribute("data-epi", d);
                  });
                  SwymUtils.addEvent(f.firstChild.querySelector("a"), "click", function (a) {
                      a.preventDefault();
                      za();
                  });
                  clearTimeout(Ja);
                  Ja = setTimeout(function () {
                      t();
                  }, 15e3);
                  SwymUtils.addEvent(f.firstChild, "mouseenter", function () {
                      window.clearTimeout(Ja);
                  });
                  SwymUtils.addEvent(f.firstChild, "mouseleave", function () {
                      Ja = setTimeout(function () {
                          t();
                      }, 15e3);
                  });
                  SwymUtils.addEvent(document.getElementById("swym-santa-close-button"), "click", function (a) {
                      a.preventDefault();
                      t();
                  });
                  l.instrument(l.Instrumentations.NotificationShown, m(d, c));
              }
              function t(a) {
                  var b = document.getElementById("swym-santa");
                  SwymUtils.removeClass(b, "swym-show");
                  setTimeout(function () {
                      SwymUtils.addClass(b, "swym-hide");
                  }, 25);
                  if (!a && window.event && SwymUtils.hasClass(window.event.currentTarget, "swym-close")) {
                      var c = document.getElementById("swym-santa");
                      a = c.getAttribute("data-nt");
                      c = c.getAttribute("data-epi");
                      l.instrument(l.Instrumentations.DismissNotification, m(c, a));
                  }
                  clearTimeout(wa);
              }
              function u(a) {
                  if (!document.querySelectorAll('#swym-tabs-nav > li[data-id="' + a + '"]').length) return !1;
                  SwymUtils.forEachElement("#swym-tabs-content > li", function (b) {
                      b.style.display = "none";
                      b.getAttribute("data-id") == a && (b.style.display = "block");
                  });
                  SwymUtils.forEachElement("#swym-tabs-toolbar > li", function (b) {
                      b.style.display = "none";
                      b.getAttribute("data-id") == a && (b.style.display = "block");
                  });
                  SwymUtils.forEachElement("#swym-tabs-nav > li", function (b) {
                      SwymUtils.removeClass(b, "is-active");
                      b.getAttribute("data-id") == a && SwymUtils.addClass(b, "is-active");
                  });
                  "settings" == a && l.instrument(l.Instrumentations.UISettings);
                  va();
              }
              function r(a, b, c, d) {
                  a = '<div class="swym-tab-overlay" role="complementary" aria-label="Tab Overlay" id="swym-tab-overlay"><div class="swym-tab-modal ' + b + '" id="swym-tab-modal"><div class="swym-tab-modal-content">' + a + "</div>";
                  c && (a += '<a href="#" class="swym-tab-modal-close" id="swym-tab-modal-close" aria-label="Close" role="navigation"><i class="swym-icon swym-close-grey"></i></a>');
                  a += "</div></div>";
                  b = document.createElement("div");
                  b.innerHTML = a;
                  b = SwymUtils.stripScripts(b);
                  d || (d = {});
                  var e;
                  d.appendTo && (e = document.getElementById(d.appendTo));
                  e = e || document.getElementById("swym-notepad");
                  e.appendChild(b);
                  (d.appendTo || SwymUtils.hasClass(document.getElementById("swym-plugin"), "show-notepad")) &&
                      setTimeout(function () {
                          SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                              SwymUtils.addClass(a, "show-tab-overlay");
                          });
                          SwymUtils.addClass(document.getElementsByTagName("body")[0], "swym-no-scroll");
                          var a = document.getElementById("swym-tab-overlay"),
                              b = document.getElementById("swym-tab-modal");
                          SwymUtils.addClass(a, "is-active");
                          SwymUtils.isTouchDevice() &&
                              ((a.ontouchmove = function (a) {
                                  var c = !1;
                                  b.querySelector(".swym-product-view-swiper, .swym-hashtageditor-list") && (c = b.contains(a.target));
                                  c || SwymUtils.preventDefault(a);
                                  a.stopPropagation();
                                  a.stopImmediatePropagation();
                              }),
                              document.body.addEventListener("touchmove", SwymUtils.preventDefault));
                      }, 10);
                  if (d.onRender) d.onRender(b);
                  if (c) {
                      var f = function () {
                          SwymUtils.removeEvent(document.body, "keyup", g);
                          w();
                          if (d.onDismiss) d.onDismiss();
                      };
                      SwymUtils.addEvent(document.getElementById("swym-tab-modal-close"), "click", function (a) {
                          a.preventDefault();
                          f();
                      });
                      a = document.getElementById("swym-tab-overlay");
                      SwymUtils.addEvent(a, "click", function (a) {
                          null == SwymUtils.findAncestor(a.srcElement, "swym-tab-modal") && (a.preventDefault(), f());
                      });
                      var g = function (a) {
                          27 == a.keyCode && (a.preventDefault(), f());
                      };
                      SwymUtils.addEvent(document.body, "keyup", g);
                  }
              }
              function w() {
                  var a = document.getElementById("swym-tab-overlay");
                  a &&
                      (SwymUtils.removeClass(a, "is-active"),
                      SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                          SwymUtils.removeClass(a, "show-tab-overlay");
                      }),
                      SwymUtils.removeClass(document.getElementsByTagName("body")[0], "swym-no-scroll"),
                      SwymUtils.isTouchDevice() && ((a.ontouchmove = null), document.body.removeEventListener("touchmove", SwymUtils.preventDefault)),
                      setTimeout(function () {
                          var b = a.parentElement;
                          b.parentElement && b.parentElement.removeChild(b);
                      }, 300));
              }
              function y(a) {
                  var b = SwymUtils.renderTemplate(M.Welcome, {});
                  r(b, "swym-welcome", !1, { appendTo: "swym-hosted-plugin" });
                  l.instrument(l.Instrumentations.UIWelcome);
                  SwymUtils.addEvent(document.getElementById("swym-welcome-button"), "click", function (b) {
                      b.preventDefault();
                      l.storage.get("launchedBefore") || (l.storage.set("launchedBefore", !0), l.instrument(l.Instrumentations.UIFirstAccess));
                      a || u("items");
                      w();
                  });
              }
              function v(a) {
                  var b = a.uri,
                      c = a.epi,
                      d = a.addToCartCallback,
                      e = a.errorCallback,
                      f = a.onlyCurrentProduct,
                      g = f ? [{ epi: c, "raw-du": b }] : a.products || Ca;
                  l.instrument(l.Instrumentations.UIOpenProductDetails, { epi: c });
                  for (var h = 0, k = 0, m = "", p = "", h = 0; h < g.length; h++) {
                      var n = g[h],
                          p = p + '<li class="swym-product-li" data-idx="' + h + '" data-uri="' + (n["raw-du"] || n.du) + '" data-epi="' + n.epi + '"><span class="loading-msg">Loading</span></li>',
                          m = m + '<li class="swym-product-pagination-li"></li>';
                      n.epi == c && l.platform.getDuFromVariantUri(n["raw-du"] || n.du) == l.platform.getDuFromVariantUri(b) && (k = h);
                  }
                  r(
                      '<div class="swym-product-view-swiper" id="swym-product-view-swiper"><ul>' +
                          p +
                          '</ul></div><div class="swym-product-pagination" id="swym-product-pagination"><ul>' +
                          m +
                          '</ul><a href="#" class="swym-next" id="swym-product-next"><i class="swym-icon swym-arrow-right-grey"></i></a><a href="#" class="swym-prev" id="swym-product-prev"><i class="swym-icon swym-arrow-left-grey"></i></a></div>',
                      "swym-product",
                      !0,
                      {
                          appendTo: a.appendTo || "swym-hosted-plugin",
                          onDismiss: function () {
                              l.instrument(l.Instrumentations.UICloseProductDetails, { epi: c });
                          },
                      }
                  );
                  z(k, d, e, f, g);
              }
              function z(a, b, c, d, e) {
                  function f(a, d) {
                      I = a;
                      SwymUtils.addClass(k, "animate");
                      var g = document.getElementById("swym-product-prev"),
                          E = document.getElementById("swym-product-next");
                      0 != I ? SwymUtils.removeClass(g, "disabled") : SwymUtils.addClass(g, "disabled");
                      I != m.length - 1 ? SwymUtils.removeClass(E, "disabled") : SwymUtils.addClass(E, "disabled");
                      g = -a * t + "px";
                      k.style.msTransform = k.style.mozTransform = k.style.webkitTransform = k.style.transform = "translate3d(" + g + ",0,0)";
                      k.setAttribute("data-offset", g);
                      for (g = 0; g < m.length; g++) SwymUtils.removeClass(m[g], "active"), SwymUtils.removeClass(p[g], "active");
                      SwymUtils.addClass(m[a], "active");
                      SwymUtils.addClass(p[a], "active");
                      var n = m[a],
                          Q = n.getAttribute("data-epi");
                      l.instrument(l.Instrumentations.UIViewProductDetails, { epi: Q });
                      if ("true" != n.getAttribute("data-loaded")) {
                          n.setAttribute("data-loaded", "true");
                          var g = n.getAttribute("data-idx"),
                              r = e[g];
                          l.api.getProductDetails(
                              r,
                              function (a) {
                                  function c() {
                                      for (var b = [], d = 0; d < e.length; d++) b.push(e[d].value);
                                      for (d = 0; d < a.variants.length; d++) {
                                          for (var g = a.variants[d], h = 1; h <= b.length; h++) {
                                              if (g["option" + h] != b[h - 1]) {
                                                  f = -1;
                                                  break;
                                              }
                                              f = d;
                                          }
                                          if (f == d) break;
                                      }
                                      b = a.variants[f];
                                      d = n.querySelector(".swym-buy button");
                                      -1 == f
                                          ? (d.setAttribute("disabled", !0), (d.innerHTML = a.unavailableCTA))
                                          : b.available
                                          ? (d.removeAttribute("disabled"), (d.innerHTML = a.addToCartCTA))
                                          : (d.setAttribute("disabled", !0), (d.innerHTML = a.soldOutCTA));
                                      d = n.querySelector(".swym-price.swym-text-color");
                                      b = SwymUtils.renderTemplate(M.Price, b);
                                      d.innerHTML = b;
                                  }
                                  var d = oa(a, r.epi);
                                  d.chosenVariantUrl = l.platform.getVariantUrlFromDu(d.url, r.epi);
                                  d.moreDetailsUrl = d.variants.length ? d.chosenVariantUrl : d.url;
                                  d = SwymUtils.renderTemplate(M.ProductView, d);
                                  n.innerHTML = d;
                                  a.variants.forEach(ka);
                                  for (var e = n.querySelectorAll("select.swym-select"), d = 0; d < e.length; d++)
                                      e[d].onchange = (function (a) {
                                          return function (a) {
                                              c();
                                          };
                                      })(d);
                                  var f = 0;
                                  D(a, e, Q, c);
                                  SwymUtils.addEvent(n.querySelectorAll("form")[0], "submit", function (c) {
                                      var d = a.variants[f];
                                      c.preventDefault();
                                      var e = n.querySelectorAll("button")[0];
                                      SwymUtils.addClass(e, "swym-loading");
                                      e.disabled = !0;
                                      a.du = r.du;
                                      l.api.replayAddToCart(
                                          a,
                                          d.id,
                                          function () {
                                              SwymUtils.removeClass(e, "swym-loading");
                                              e.disabled = !1;
                                              e.innerHTML = a.addedCTA;
                                              b ? b(a, h) : l.openCartPage();
                                          },
                                          function () {
                                              alert("Error");
                                          }
                                      );
                                  });
                                  SwymUtils.forEachElement(
                                      ".swym-redirect",
                                      function (a) {
                                          SwymUtils.addEvent(a, "click", function (a) {
                                              l.instrument(l.Instrumentations.ItemClickFromProductDetails, { epi: Q });
                                          });
                                      },
                                      n
                                  );
                                  SwymUtils.addClass(n, "loaded");
                              },
                              function (a) {
                                  SwymUtils.addClass(n, "not-loaded");
                                  var b = n.getAttribute("data-uri");
                                  n.innerHTML = SwymUtils.renderTemplateString('<span class="loading-msg">{{ProductNotFound}}<br/> <a target="_blank" href="{{uri}}">{{uri}}</a></span>', { ProductNotFound: q.ProductNotFound, uri: b });
                                  n = SwymUtils.stripScripts(n);
                                  c && c(a);
                              }
                          );
                      }
                  }
                  function g() {
                      t = n.offsetWidth - 2;
                      r = n.offsetHeight - 2;
                      h.style.width = t + "px";
                      h.style.height = r + "px";
                      r -= 40;
                      k.style.width = m.length * t + "px";
                      k.style.height = r + "px";
                      for (var a = 0; a < m.length; a++) (m[a].style.width = t + "px"), (m[a].style.height = r + "px");
                      f(I);
                  }
                  var h = document.getElementById("swym-product-view-swiper"),
                      k = h.getElementsByTagName("ul")[0],
                      m = k.querySelectorAll("li.swym-product-li"),
                      p = document.getElementById("swym-product-pagination").querySelectorAll("li.swym-product-pagination-li"),
                      n = document.getElementById("swym-tab-modal"),
                      t = n.offsetWidth,
                      r = n.offsetHeight,
                      I = a,
                      u = 0;
                  (function (a, b) {
                      var c,
                          d,
                          e,
                          f,
                          g,
                          h,
                          k,
                          m,
                          l,
                          E = b || function (a, b, c, d, e) {};
                      a.addEventListener(
                          "touchstart",
                          function (a) {
                              var b = a.changedTouches[0];
                              e = d = c = "none";
                              f = b.pageX;
                              g = b.pageY;
                              l = new Date().getTime();
                              E(a, "none", "start", e, 0);
                          },
                          !1
                      );
                      a.addEventListener(
                          "touchmove",
                          function (a) {
                              var b = a.changedTouches[0];
                              h = b.pageX - f;
                              k = b.pageY - g;
                              Math.abs(h) > Math.abs(k)
                                  ? ((c = 0 > h ? "left" : "right"), "none" == d && (d = "horizontal"), "vertical" == d ? a.preventDefault() : E(a, c, "move", e, h))
                                  : ((c = 0 > k ? "up" : "down"), "none" == d && (d = "vertical"), "horizontal" == d ? a.preventDefault() : E(a, c, "move", e, k));
                          },
                          !1
                      );
                      a.addEventListener(
                          "touchend",
                          function (a) {
                              m = new Date().getTime() - l;
                              500 >= m && (50 <= Math.abs(h) && 100 >= Math.abs(k) ? (e = c) : 50 <= Math.abs(k) && 100 >= Math.abs(h) && (e = c));
                              E(a, c, "end", e, "left" == c || "right" == c ? h : k);
                          },
                          !1
                      );
                  })(h, function (a, b, c, d, e) {
                      if ("start" == c) SwymUtils.removeClass(k, "animate"), (u = parseInt(k.getAttribute("data-offset")) || 0);
                      else if ("move" == c && ("left" == b || "right" == b))
                          (a = Math.min(e + u, (I + 1) * t) + "px"), (k.style.msTransform = k.style.mozTransform = k.style.webkitTransform = k.style.transform = "translate3d(" + a + ",0,0)"), k.setAttribute("data-offset", a);
                      else if ("end" == c) {
                          if ("left" == d || "right" == d) I = "left" == d ? Math.min(I + 1, m.length - 1) : Math.max(I - 1, 0);
                          f(I, !0);
                      }
                  });
                  var v = SwymUtils.debounce(g, 300);
                  SwymUtils.addEvent(window, "resize", v);
                  SwymUtils.addEvent(document.getElementById("swym-tab-modal-close"), "click", function (a) {
                      SwymUtils.removeEvent(window, "resize", v);
                  });
                  SwymUtils.addEvent(document.getElementById("swym-product-prev"), "click", function (a) {
                      a.preventDefault();
                      0 != I && I--;
                      f(I, !0);
                  });
                  SwymUtils.addEvent(document.getElementById("swym-product-next"), "click", function (a) {
                      a.preventDefault();
                      I != m.length - 1 && I++;
                      f(I, !0);
                  });
                  g();
              }
              function D(a, b, c, d) {
                  for (var e, f = 0; f < a.variants.length; f++)
                      if (a.variants[f].id == c) {
                          e = a.variants[f];
                          break;
                      }
                  for (f = 0; f < b.length; f++) b[f].value = e["option" + (f + 1)];
                  d();
              }
              function B(a) {
                  l.storage.set("currentFilter", l.storage.get("currentFilter") || J.DefaultFilter || q.AllFilter);
                  ga(l.getRelayFilters(), "#swym-item-filter", "currentFilter", '<a href="#" data-id="{{val}}">{{filterVal}}</a>', J.HideAllFilter ? null : { val: "0", filter: q.AllFilter }, function (a) {
                      a.preventDefault();
                      qa(a.currentTarget.innerHTML);
                  });
                  l.isCollectionsEnabled() &&
                      l.api.getAllCollections(function (b) {
                          ga(b, "#swym-hashtag-filter", "currentHashtag", '<a href="#" data-id="{{filter}}" data-et="4">{{filterVal}}</a>', { val: [], filter: J.Title }, function (a) {
                              a.preventDefault();
                              la(a.currentTarget.getAttribute("data-id"), !0);
                          });
                          (b = document.querySelector("#swym-hashtag-filter li.is-active")) && b.scrollIntoViewIfNeeded();
                          qa(l.storage.get("currentFilter"), a);
                      });
                  qa(l.storage.get("currentFilter"), a);
                  l.api.authCheck(function (a) {
                      W(a);
                      Y(a);
                  });
                  1 != this.hasUiInitalized && ((this.hasUiInitalized = !0), A());
                  J.NoWelcomeScreen || (l.storage.get("launchedBefore") && !l.storage.get(l.key.TURNOFF)) || y(a);
                  u("items");
              }
              function A() {
                  var a = document.getElementById("swym-email-note-input"),
                      b = SwymUtils.isUndefined(l.retailerSettings.Email.DefaultNote) ? q.ShareEmailNotePlaceholder : l.retailerSettings.Email.DefaultNote;
                  a.value = b;
                  SwymUtils.addEvent(document.getElementById("swym-close-notepad-button"), "click", function (a) {
                      a.preventDefault();
                      g();
                  });
                  SwymUtils.addEvent(document.getElementById("swym-overlay"), "click", function (a) {
                      a.preventDefault();
                      g();
                  });
                  SwymUtils.addEvent(document.getElementById("swym-welcome-open-trigger"), "click", function (a) {
                      a.preventDefault();
                      y();
                  });
                  SwymUtils.forEachElement("#swym-tabs-nav a", function (a) {
                      SwymUtils.addEvent(a, "click", function (b) {
                          b.preventDefault();
                          b = a.parentNode.getAttribute("data-id");
                          u(b);
                      });
                  });
                  SwymUtils.addEvent(document.getElementById("swym-item-filter-toggle"), "click", function (a) {
                      a.preventDefault();
                      var b = document.getElementById("swym-notepad"),
                          c = document.getElementById("swym-item-filter");
                      SwymUtils.hasClass(c, "is-active")
                          ? (SwymUtils.removeClass(c, "is-active"), (b.onclick = null))
                          : (SwymUtils.addClass(c, "is-active"),
                            setTimeout(function () {
                                b.onclick = function () {
                                    SwymUtils.removeClass(c, "is-active");
                                    b.onclick = null;
                                };
                            }, 10));
                  });
                  SwymUtils.addEvent(document.getElementById("swym-hashtag-filter-toggle"), "click", function (a) {
                      a.preventDefault();
                      var b = document.getElementById("swym-notepad"),
                          c = document.getElementById("swym-hashtag-filter");
                      SwymUtils.hasClass(c, "is-active")
                          ? (SwymUtils.removeClass(c, "is-active"), (b.onclick = null))
                          : (SwymUtils.addClass(c, "is-active"),
                            setTimeout(function () {
                                b.onclick = function () {
                                    SwymUtils.removeClass(c, "is-active");
                                    b.onclick = null;
                                };
                            }, 10));
                  });
                  SwymUtils.addEvent(document.getElementById("swym-email-friend-form"), "submit", function (a) {
                      a.preventDefault();
                      document.getElementById("swym-email-friend-button").click();
                  });
                  SwymUtils.addEvent(document.getElementById("swym-email-friend-button"), "click", function (a) {
                      a.preventDefault();
                      a = document.getElementById("swym-from-friend-input");
                      var c = document.getElementById("swym-email-friend-input"),
                          d = document.getElementById("swym-email-friend-button"),
                          e = document.getElementById("swym-email-note-input"),
                          f = document.getElementById("swym-email-friend-message"),
                          g = c.value.trim(),
                          h = a.value.trim();
                      a = e.value.trim().replace(/\n/g, "<br/>").replace(/ /g, "&nbsp;");
                      SwymUtils.validateEmail(g)
                          ? h
                              ? a || a == b
                                  ? 0 == ra
                                      ? ((f.innerHTML = SwymUtils.renderTemplateString('<span class="swym-error">{{ShareEmailMsgItemsError}}</span>', { ShareEmailMsgItemsError: q.ShareEmailMsgItemsError })),
                                        setTimeout(function () {
                                            f.innerHTML = "";
                                        }, 5e3))
                                      : ((f.innerHTML = ""),
                                        SwymUtils.addClass(d, "swym-loading"),
                                        (d.disabled = !0),
                                        (c = l.storage.get("currentHashtag")),
                                        l.api.sendEmailWishList(
                                            function () {
                                                SwymUtils.removeClass(d, "swym-loading");
                                                d.disabled = !1;
                                                l.instrument(l.Instrumentations.EmailedMyFaves, { from: h, to: g });
                                                f.innerHTML = SwymUtils.renderTemplateString('<span class="swym-success">{{ShareEmailMsgSuccess}}</span>', { ShareEmailMsgSuccess: q.ShareEmailMsgSuccess });
                                                setTimeout(function () {
                                                    f.innerHTML = "";
                                                    var a = document.getElementById("swym-email-container");
                                                    SwymUtils.removeClass(a, "is-active");
                                                    document.getElementById("swym-notepad").onclick = null;
                                                }, 5e3);
                                            },
                                            g,
                                            h,
                                            a,
                                            c == J.Title ? null : c,
                                            function () {
                                                SwymUtils.removeClass(d, "swym-loading");
                                                d.disabled = !1;
                                                f.innerHTML = SwymUtils.renderTemplateString('<span class="swym-error">{{ShareEmailSendError}}</span>', { ShareEmailSendError: q.ShareEmailSendError });
                                            }
                                        ))
                                  : ((f.innerHTML = SwymUtils.renderTemplateString('<span class="swym-error">{{ShareEmailMsgNoteError}}</span>', { ShareEmailMsgNoteError: q.ShareEmailMsgNoteError })),
                                    setTimeout(function () {
                                        f.innerHTML = "";
                                    }, 5e3))
                              : ((f.innerHTML = SwymUtils.renderTemplateString('<span class="swym-error">{{ShareEmailMsgFromError}}</span>', { ShareEmailMsgFromError: q.ShareEmailMsgFromError })),
                                setTimeout(function () {
                                    f.innerHTML = "";
                                }, 5e3))
                          : ((f.innerHTML = SwymUtils.renderTemplateString('<span class="swym-error">{{MsgInvalidEmail}}</span>', { MsgInvalidEmail: q.MsgInvalidEmail })),
                            setTimeout(function () {
                                f.innerHTML = "";
                            }, 5e3));
                  });
                  SwymUtils.addEvent(document.getElementById("swym-email-toggle"), "click", function (a) {
                      l.openShareWishlistSocial(
                          a,
                          function () {},
                          function () {}
                      );
                  });
                  SwymUtils.addEvent(document.getElementById("swym-search-button"), "click", function (a) {
                      a.preventDefault();
                      a = this.parentNode;
                      var b = document.getElementById("swym-search-input");
                      SwymUtils.hasClass(a, "is-active") ? (SwymUtils.removeClass(a, "is-active"), b.blur(), (b.value = ""), qa()) : (SwymUtils.addClass(a, "is-active"), b.focus());
                  });
                  SwymUtils.addEvent(document.getElementById("swym-search-form"), "submit", function (a) {
                      a.preventDefault();
                      qa();
                  });
                  SwymUtils.addEvent(
                      document.getElementById("swym-search-input"),
                      "keyup",
                      SwymUtils.debounce(function () {
                          qa();
                      }, 300)
                  );
              }
              function F() {
                  var a = document.querySelector("#swym-plugin #notepad-anchor-title");
                  if (a) {
                      var b = J;
                      SwymUtils.addClass(document.getElementById("swym-anchor"), "swym-" + (b.LauncherButtonType || ""));
                      SwymUtils.addClass(document.getElementById("swym-anchor"), "swym-" + (b.LauncherIcon || "heart"));
                      a.innerHTML = SwymUtils.renderTemplateString('<i class="swym-icon swym-notepad-white"></i>{{uiTitle}}', { uiTitle: b.Title });
                  } else console.error("Cannot find object with id notepad-anchor-title");
              }
              function P(a) {
                  T({ message: a });
                  SwymUtils.addClass(document.getElementById("swym-plugin"), "show-gen-toast");
                  a = document.getElementById("swym-toast");
                  clearTimeout(Ka);
                  Ka = setTimeout(function () {
                      R();
                  }, 8e3);
                  SwymUtils.addEvent(a.firstChild, "mouseenter", function () {
                      window.clearTimeout(Ka);
                  });
                  SwymUtils.addEvent(a.firstChild, "mouseleave", function () {
                      Ka = setTimeout(function () {
                          R();
                      }, 8e3);
                  });
              }
              function R() {
                  SwymUtils.removeClass(document.getElementById("swym-plugin"), "show-gen-toast");
              }
              function T(a) {
                  var b = document.getElementById("swym-toast");
                  a = SwymUtils.renderTemplate(M.GenToast, a);
                  b.innerHTML = a;
              }
              function U(a, b, c) {
                  var d = b || {};
                  d.dt && (d.dt = ia(d.dt));
                  for (var e in a) d[e] = a[e];
                  d.du || (d.du = "javascript:void(0);");
                  d.dt || (d.dt = a.msg);
                  !d.iu && a.img && (d.iu = a.img);
                  SwymUtils.isUndefined(d.et) && (d.et = "-");
                  d = SwymUtils.formatProductPrice(d);
                  e = document.getElementById("swym-notification");
                  l.triggerSwymEvent(f.JSEvents.beforeRenderNotification, d, e);
                  var g = SwymUtils.renderTemplate(M.Notification, d);
                  e.innerHTML = g;
                  e = SwymUtils.stripScripts(e);
                  e.setAttribute("data-tab-et", a.tabEt ? a.tabEt : "");
                  e.setAttribute("data-tab", a.tab ? a.tab : "");
                  e.setAttribute("data-nt", a.nt);
                  e.setAttribute("data-epi", c);
                  a.requiresProduct ? SwymUtils.removeClass(e, "swym-santa") : SwymUtils.addClass(e, "swym-santa");
                  SwymUtils.addEvent(document.getElementById("swym-notification-title"), "click", function (a) {
                      0 != document.getElementById("swym-notification-content").offsetHeight ||
                          SwymUtils.hasClass(document.getElementById("swym-notification"), "expanded") ||
                          (SwymUtils.addClass(document.getElementById("swym-notification"), "expanded"), clearTimeout(wa), a.preventDefault());
                  });
                  SwymUtils.addEvent(e.querySelector(".swym-view-history"), "click", function () {
                      ma();
                  });
                  SwymUtils.addEvent(document.getElementById("swym-close-notification-button"), "click", function (a) {
                      a.preventDefault();
                      p();
                  });
                  b ||
                      SwymUtils.addElementDOMEventListener(".swym-inner a:not(.swym-view-history)", e, "click", function (b) {
                          b.preventDefault();
                          ma(a);
                      });
                  l.triggerSwymEvent(f.JSEvents.renderNotification, d, e);
                  SwymUtils.addElementDOMEventListener("a:not(.swym-close):not(.swym-view-history)", e, "click", function (b) {
                      l.instrument(l.Instrumentations.ItemClickFromNotification, m(d.epi, a.nt));
                      b.currentTarget.href == location.href && b.preventDefault();
                  });
              }
              function Y(a) {
                  var b = document.getElementById("swym-auth");
                  b && b.parentElement.removeChild(b);
                  a = SwymUtils.renderTemplate(M.SettingsAuth, a);
                  document.getElementById("swym-auth-container").insertAdjacentHTML("afterbegin", a);
                  SwymUtils.removeClass(document.getElementById("swym-auth-container"), "swym-message-shown");
                  SwymUtils.addEvent(document.getElementById("swym-email-auth-form"), "submit", function (a) {
                      a.preventDefault();
                      document.getElementById("swym-email-auth-button").click();
                  });
                  SwymUtils.addEvent(document.getElementById("swym-email-auth-button"), "click", function (a) {
                      function b(a, c) {
                          document.getElementById("swym-email-auth-message").innerHTML = SwymUtils.renderTemplateString('<span class="swym-{{type}}">{{message}}</span>', { type: a, message: c });
                      }
                      var c = document.getElementById("swym-email-auth-input"),
                          d = document.getElementById("swym-email-auth-button");
                      a = document.getElementById("swym-email-auth-message");
                      SwymUtils.validateEmail(c.value)
                          ? ((a.innerHTML = ""),
                            SwymUtils.addClass(d, "swym-loading"),
                            (d.disabled = !0),
                            SwymUtils.removeClass(document.getElementById("swym-auth-container"), "swym-message-shown"),
                            SwymUtils.hasClass(d, "connect")
                                ? l.remoteAuthRequest(
                                      function (a) {
                                          setTimeout(function () {
                                              SwymUtils.removeClass(d, "swym-loading");
                                              d.disabled = !1;
                                              SwymUtils.addClass(document.getElementById("swym-auth-container"), "swym-message-shown");
                                              var c = "";
                                              a.message && (c = a.message);
                                              a.error ? (c || (c = q.AuthMsgDefaultError), b("error", c)) : ((c = q.AuthMsgConnectSuccess), b("success", c));
                                          }, 500);
                                      },
                                      function (a, c) {
                                          setTimeout(function () {
                                              SwymUtils.removeClass(d, "swym-loading");
                                              SwymUtils.addClass(document.getElementById("swym-auth-container"), "swym-message-shown");
                                              d.disabled = !1;
                                              var a = c.responseBody;
                                              a || (a = q.AuthMsgDefaultError);
                                              b("error", a);
                                          }, 500);
                                      },
                                      c.value
                                  )
                                : l.removeUserFromDevice(
                                      function (a) {
                                          setTimeout(function () {
                                              SwymUtils.removeClass(d, "swym-loading");
                                              SwymUtils.addClass(document.getElementById("swym-auth-container"), "swym-message-shown");
                                              d.disabled = !1;
                                              var e = "";
                                              a.message && (e = a.message);
                                              a.error
                                                  ? (e || (e = q.AuthMsgDisconnectError), b("error", e))
                                                  : (e || (e = SwymUtils.renderTemplateString(q.AuthMsgDisconnectSuccess, { userId: c.value })),
                                                    b("success", e),
                                                    SwymUtils.removeClass(d, "disconnect"),
                                                    SwymUtils.addClass(d, "connect"),
                                                    (c.disabled = !1),
                                                    (c.value = ""),
                                                    (d.innerHTML = q.SettingsConnectCTA),
                                                    W({}));
                                          }, 500);
                                      },
                                      function (a, c) {
                                          setTimeout(function () {
                                              SwymUtils.removeClass(d, "swym-loading");
                                              SwymUtils.addClass(document.getElementById("swym-auth-container"), "swym-message-shown");
                                              d.disabled = !1;
                                              var a = "";
                                              a = q.AuthMsgDisconnectError;
                                              b("error", a);
                                          }, 500);
                                      }
                                  ))
                          : (b("error", q.MsgInvalidEmail), SwymUtils.addClass(document.getElementById("swym-auth-container"), "swym-message-shown"));
                  });
              }
              function W(a) {
                  if ("object" != typeof a) return SwymUtils.warn("Invalid user json"), !1;
                  document.getElementById("swym-from-friend-input").value = a.email || "";
                  document.getElementById("swym-user-information-description") &&
                      (a.email ? (document.getElementById("swym-user-information-description").innerHTML = q.SettingsUserRemoveDesc) : (document.getElementById("swym-user-information-description").innerHTML = q.SettingsUserInfoDesc));
                  document.getElementById("swym-current-user").innerHTML = a.email || q.SettingsUserGuest;
              }
              function X(a) {
                  document.getElementById("swym-no-items").style.display = a ? "none" : "block";
              }
              function V(a, b, c, d) {
                  function e() {
                      l.triggerSwymEvent(f.JSEvents.renderProducts, a, m);
                      SwymUtils.forEachElement("#swym-item-grid .swym-remove a", function (b, c) {
                          SwymUtils.addEvent(b, "click", function (e) {
                              e.preventDefault();
                              e = SwymUtils.getClosest(b, ".swym-item");
                              (l.storage.get("currentHashtag") !== l.retailerSettings.RelayUI.Title && d.deleteHandler ? d.deleteHandler : na).call(this, a[c], e.getAttribute("id"));
                          });
                      });
                      J.EnableProductView &&
                          (SwymUtils.addClass(m, "show-add-to-cart"),
                          SwymUtils.forEachElement("#swym-item-grid a.swym-link", function (a) {
                              SwymUtils.addEvent(a, "click", function (b) {
                                  b.preventDefault();
                                  var c = SwymUtils.getClosest(a, ".swym-item");
                                  b = c.getAttribute("data-uri");
                                  c = c.getAttribute("data-epi");
                                  v({ uri: b, epi: c });
                              });
                          }),
                          SwymUtils.forEachElement("#swym-item-grid .swym-add-to-cart a", function (a) {
                              SwymUtils.addEvent(a, "click", function (b) {
                                  b.preventDefault();
                                  var c = SwymUtils.getClosest(a, ".swym-item");
                                  b = c.getAttribute("data-epi");
                                  c = c.getAttribute("data-uri");
                                  SwymUtils.addClass(a.parentNode, "swym-loading");
                                  a.disabled = !0;
                                  ba({
                                      epi: b,
                                      uri: c,
                                      callback: function (b) {
                                          SwymUtils.removeClass(a.parentNode, "swym-loading");
                                          a.disabled = !1;
                                          a.innerHTML = SwymUtils.renderTemplateString(b.addedCTA, {});
                                          l.openCartPage();
                                      },
                                      openProductScreenCallback: function () {
                                          a.disabled = !1;
                                          SwymUtils.removeClass(a.parentNode, "swym-loading");
                                      },
                                      errorCallback: function () {
                                          SwymUtils.removeClass(a.parentNode, "swym-loading");
                                          a.disabled = !1;
                                      },
                                  });
                              });
                          }));
                  }
                  function g(a, b) {
                      b = b || {};
                      var c = document.createElement("li");
                      c.className = "swym-item";
                      c.id = a._id;
                      c.setAttribute("data-uri", a["raw-du"] || a.uri);
                      c.setAttribute("data-epi", a.epi);
                      c.setAttribute("data-idx", ea.itemsToProcess - 1);
                      l.triggerSwymEvent(f.JSEvents.beforeRenderProduct, a, c);
                      var d = SwymUtils.renderTemplate(M.ProductTile, a);
                      c.innerHTML = d;
                      c = SwymUtils.stripScripts(c);
                      l.triggerSwymEvent(f.JSEvents.renderProduct, a, c);
                      (d = m.querySelector(SwymUtils.renderTemplateString("#swtmp_{{et}}_{{epi}}", a))) && m.replaceChild(c, d);
                      b.hashtag || SwymUtils.addElementDOMEventListener(".swym-remove a", c, "click", ua(l.Instrumentations.DeleteItem, a));
                      SwymUtils.addElementDOMEventListener(".swym-image img", c, "error", Ba(a, c));
                      J.EnableProductView || SwymUtils.addElementDOMEventListener('a:not([href="#"]):not(.swym-remove)', c, "click", ua(l.Instrumentations.ItemClickFromRelay, a));
                      a.disableAddToCart && ((d = c.querySelector(".swym-add-to-cart a")), SwymUtils.addClass(d, "disabled"), (d.innerHTML = SwymUtils.renderTemplateString(a.soldOutCTA, {})), delete a.disableAddToCart);
                      return c;
                  }
                  function h(a, b) {
                      var c = m.querySelector(SwymUtils.renderTemplateString("#swtmp_{{et}}_{{epi}}", a));
                      m.removeChild(c);
                      ea.stepAsync();
                  }
                  var k = J.GridPagedRender;
                  d = d || {};
                  var m = document.getElementById("swym-item-grid");
                  m.innerHTML = "";
                  ra = a.length;
                  X(ra);
                  b = { products: a, tab: b, query: c };
                  l.triggerSwymEvent(f.JSEvents.beforeRenderProducts, b);
                  a = b.products;
                  var n = document.createDocumentFragment();
                  a.forEach(function (a) {
                      a = SwymUtils.renderTemplateString('<li id="swtmp_{{et}}_{{epi}}" class="swym-item swym-item-loading swym-loader swym-loading"><div class="swym-outer"></div></li>', a);
                      var b = document.createElement("div");
                      b.innerHTML = a;
                      node = b.children[0];
                      n.appendChild(node);
                  });
                  m.appendChild(n);
                  if (k) {
                      var p = 0;
                      Ca = [];
                      numProducts = a.length;
                      k = SwymUtils.arrayPartition(a, J.GridPageSize);
                      ea = new SwymUtils.Iterator(
                          k,
                          function () {
                              ea.current().forEach(function (b) {
                                  l.getSwymProductDetails(
                                      b,
                                      function (c, e) {
                                          e
                                              ? h(b, d)
                                              : ja(c, function (b) {
                                                    Ca.push(c);
                                                    productLi = g(b, d);
                                                    SwymUtils.addEvent(productLi.querySelector(".swym-remove a"), "click", function (b) {
                                                        b.preventDefault();
                                                        b = SwymUtils.getClosest(b.currentTarget, ".swym-item");
                                                        (l.storage.get("currentHashtag") !== l.retailerSettings.RelayUI.Title && d.deleteHandler ? d.deleteHandler : na).call(this, a[p], b.getAttribute("id"));
                                                    });
                                                    J.EnableProductView &&
                                                        (SwymUtils.addEvent(productLi.querySelector("a.swym-link"), "click", function (a) {
                                                            a.preventDefault();
                                                            var b = SwymUtils.getClosest(a.currentTarget, ".swym-item");
                                                            a = b.getAttribute("data-uri");
                                                            b = b.getAttribute("data-epi");
                                                            v({ uri: a, epi: b });
                                                        }),
                                                        SwymUtils.addEvent(productLi.querySelector(".swym-add-to-cart a"), "click", function (a) {
                                                            a.preventDefault();
                                                            var b = a.currentTarget,
                                                                c = SwymUtils.getClosest(b, ".swym-item");
                                                            a = c.getAttribute("data-epi");
                                                            c = c.getAttribute("data-uri");
                                                            SwymUtils.addClass(b.parentNode, "swym-loading");
                                                            b.disabled = !0;
                                                            ba({
                                                                epi: a,
                                                                uri: c,
                                                                callback: function (a) {
                                                                    SwymUtils.removeClass(b.parentNode, "swym-loading");
                                                                    b.disabled = !1;
                                                                    b.innerHTML = a.addedCTA;
                                                                    l.openCartPage();
                                                                },
                                                                openProductScreenCallback: function () {
                                                                    b.disabled = !1;
                                                                    SwymUtils.removeClass(b.parentNode, "swym-loading");
                                                                },
                                                                errorCallback: function () {
                                                                    SwymUtils.removeClass(b.parentNode, "swym-loading");
                                                                    b.disabled = !1;
                                                                },
                                                            });
                                                        }));
                                                    if (Ca.length == (ea.curr + 1) * J.GridPageSize || Ca.length == numProducts)
                                                        l.swymProductDetailsQueuesFlush(!0, !0, !0),
                                                            setTimeout(function () {
                                                                ea.step();
                                                            });
                                                });
                                          p++;
                                      },
                                      !0,
                                      !0
                                  );
                              });
                          },
                          function () {
                              l.swymProductDetailsQueuesFlush(!0, !0, !0);
                          },
                          function () {
                              l.swymProductDetailsQueuesFlush(!0, !0, !0);
                              l.triggerSwymEvent(f.JSEvents.renderProducts, a, m);
                              J.EnableProductView && SwymUtils.addClass(m, "show-add-to-cart");
                          }
                      );
                      ea.step();
                  } else
                      (Ca = a),
                          (ea = new SwymUtils.Iterator(
                              a,
                              function (a) {
                                  ja(a, function (a) {
                                      g(a, d);
                                      ea.stepAsync();
                                  });
                              },
                              function () {},
                              e
                          )),
                          ea.startAsync();
              }
              function ba(a) {
                  var b = a.epi,
                      c = a.uri,
                      d = a.callback,
                      e = a.openProductScreenCallback,
                      f = a.errorCallback,
                      g = a.onlyCurrentProduct;
                  l.api.getProductDetails({ epi: b, empi: a.empi, du: c }, function (a) {
                      try {
                          if ((oa(a), l.instrument(l.Instrumentations.UIProductDetailsForAddToCart, { epi: b }), 1 == a.variants.length && a.variants[0].available))
                              (a.du = c),
                                  l.api.replayAddToCart(
                                      a,
                                      a.variants[0].id,
                                      function () {
                                          d && d(a);
                                      },
                                      function (a) {
                                          alert("Error");
                                          f && f(a);
                                      }
                                  );
                          else if (pa.ProductLevel == l.ProductLevels.ProductVariant)
                              for (var h = 0; h < a.variants.length; h++) {
                                  var k = a.variants[h];
                                  if (k.id == b) {
                                      k.available
                                          ? ((a.du = c),
                                            l.api.replayAddToCart(
                                                a,
                                                b,
                                                function () {
                                                    d && d(a);
                                                },
                                                function (a) {
                                                    alert("Error");
                                                    f && f(a);
                                                }
                                            ))
                                          : f();
                                      break;
                                  }
                              }
                          else v({ uri: c, epi: b, addToCartCallback: d, errorCallback: f, onlyCurrentProduct: g }), e && e(a, b, c);
                      } catch (m) {
                          f && f(m), SwymUtils.log("Error loading product for addToCart", m, { epi: b });
                      }
                  });
              }
              function aa(a, b) {
                  if (a != q.AllFilter)
                      if ((4 == b) & l.isCollectionsEnabled()) {
                          var c = l.storage.get("currentHashtag"),
                              d = c == J.Title,
                              e = d ? b : c;
                          (d ? l.api.fetchWrtEventTypeET : l.api.fetchWishlistWRTHashtag).call(
                              l,
                              function (c) {
                                  V(c, a, b, { deleteHandler: Aa(e), hashtag: !0 });
                              },
                              e
                          );
                      } else
                          l.api.fetchWrtEventTypeET(function (c) {
                              V(c, a, b);
                          }, b);
                  else
                      l.api.fetch(function (c) {
                          V(c, a, b);
                      }, "relay");
              }
              function ga(a, b, c, d, e, f) {
                  if ("object" != typeof a) return SwymUtils.warn("Invalid filters json"), !1;
                  b = document.querySelector(b);
                  b.innerHTML = "";
                  c = l.storage.get(c);
                  e && ((e.filterVal = decodeURIComponent(e.filter)), (e = L(d, e, c)), b.appendChild(e));
                  for (var g in a) (e = { val: a[g], filter: g, filterVal: decodeURIComponent(g) }), (e = L(d, e, c)), b.appendChild(e);
                  SwymUtils.forEachElement(
                      "a",
                      function (a) {
                          SwymUtils.addEvent(a, "click", f);
                      },
                      b
                  );
              }
              function L(a, b, c) {
                  var d = document.createElement("li");
                  SwymUtils.equalsIgnoreCase(c, b.filter) && (d.className = "is-active");
                  d.innerHTML = SwymUtils.renderTemplateString(a, b);
                  return d;
              }
              function ja(a, b) {
                  function c(a) {
                      a.dt = ia(a.dt);
                      G(a);
                      b(a);
                  }
                  a.et == l.EventTypes.deleteEvent && ea.stepAsync();
                  a = SwymUtils.formatProductPrice(a);
                  var d = a.ts;
                  d && (a.dateStr = SwymUtils.timeSince(d));
                  a.deviceType = SwymUtils.formatDeviceCategory(a.dcat1);
                  var d = pa.ProductLevel,
                      e = a.et;
                  e == l.EventTypes.addToCart && (a.incart = "1");
                  e == l.EventTypes.addToWishlist && (a.inwishlist = "1");
                  e == l.EventTypes.addToWishlist && d == l.ProductLevels.ProductVariant
                      ? l.api.getProductDetails(
                            a,
                            function (b) {
                                b = b.variants;
                                for (var d = a, e = 0; e < b.length; e++)
                                    if (b[e].id == d.epi) {
                                        d.dt = b[e].name;
                                        b[e].available || (d.disableAddToCart = !0);
                                        break;
                                    }
                                c(a);
                            },
                            function () {
                                c(a);
                            }
                        )
                      : c(a);
              }
              function G(a) {
                  a.addToCartCTA = q.AddToCartCTA || l.getThemeString(l.ThemeStringKeys.addToCart);
                  a.soldOutCTA = q.SoldOutCTA || l.getThemeString(l.ThemeStringKeys.soldOut);
                  a.unavailableCTA = q.UnavailableCTA;
                  a.addedCTA = q.AddedToCartCTA;
                  a.wishlistSettings = Z;
                  return a;
              }
              function oa(a, b) {
                  G(a);
                  if (b)
                      for (var c = 0; c < a.variants.length; c++)
                          if (a.variants[c].id == b) {
                              a.variants[c].featured_image && (a.iu = a.variants[c].featured_image.src);
                              break;
                          }
                  a.iu || (a.iu = a.images[0]);
                  a.cu = l.currency;
                  a.title = ia(a.title);
                  ka(a);
                  xa(a);
                  return a;
              }
              function xa(a) {
                  if (1 < a.options.length || "Title" != a.options[0].name || "Default Title" != a.options[0].values[0])
                      a.optionsSorted = a.options.sort(function (a, b) {
                          a.position > b.position ? 1 : a.position < b.position ? -1 : 0;
                      });
              }
              function ka(a) {
                  a.cu = l.currency;
                  (null == a.compare_at_price || 0 == a.compare_at_price || a.compare_at_price <= a.price) && delete a.compare_at_price;
                  ["price", "compare_at_price"].forEach(function (b) {
                      "number" == typeof a[b] ? (a[b] = (a[b] / 100).toFixed(2)) : isNaN(parseFloat(a[b])) || (a[b] = parseFloat(a[b]).toFixed(2));
                  });
              }
              function ia(a) {
                  return 40 < a.length ? a.substring(0, 37) + "..." : a;
              }
              function qa(a, b) {
                  SwymUtils.removeClass(document.getElementById("swym-item-filter"), "is-active");
                  SwymUtils.removeClass(document.getElementById("swym-item-actions"), "show-email");
                  a || (a = l.storage.get("currentFilter"));
                  var c = l.getRelayFilters();
                  (a && c[a]) || (a = q.AllFilter);
                  document.getElementById("swym-current-filter").innerHTML = SwymUtils.renderTemplateString(a, {});
                  var d = document.getElementById("swym-search-input").value.trim();
                  if (d)
                      l.instrument(l.Instrumentations.ChangeTab, { filter: d, search: !0 }),
                          l.api.fetch(
                              function (a) {
                                  V(a, l.SearchFilterName, d);
                              },
                              "relaySearch",
                              d
                          );
                  else {
                      l.storage.set("currentFilter", a);
                      b || l.instrument(l.Instrumentations.ChangeTab, { filter: a });
                      var c = l.shouldShowEmail(),
                          e = document.getElementById("swym-item-filter"),
                          f = e.children;
                      (e = e.querySelector("li.is-active")) && SwymUtils.removeClass(e, "is-active");
                      for (var e = 0, g = f.length; g--; ) {
                          var h = f[g],
                              k = h.children[0];
                          if ((k.innerText || k.textContent).toLowerCase() == a.toLowerCase()) {
                              e = k.getAttribute("data-id");
                              SwymUtils.addClass(h, "is-active");
                              break;
                          }
                      }
                      if (4 == e || 1 < e.length) c && SwymUtils.addClass(document.getElementById("swym-item-actions"), "show-email"), l.isCollectionsEnabled() && la();
                      aa(a, e);
                  }
                  u("items");
              }
              function la(a, b) {
                  SwymUtils.removeClass(document.getElementById("swym-hashtag-filter"), "is-active");
                  if (a) {
                      l.instrument(l.Instrumentations.ChangeHashtag, { hashtag: a });
                      var c = document.querySelector('#swym-hashtag-filter a[data-id="' + a + '"]');
                      if (c) {
                          var d = document.querySelector("#swym-hashtag-filter li.is-active");
                          d && SwymUtils.removeClass(d, "is-active");
                          SwymUtils.addClass(c.parentNode, "is-active");
                          document.getElementById("swym-current-hashtag").innerHTML = SwymUtils.renderTemplateString(decodeURIComponent(a), {});
                          l.storage.set("currentHashtag", a);
                          b && aa(l.storage.get("currentFilter"), 4);
                      }
                  } else (a = l.storage.get("currentHashtag")), l.storage.remove("currentHashtag"), la(a || J.Title, b);
              }
              function ma(a) {
                  a && a.callback && a.callback();
                  p(!0);
                  setTimeout(function () {
                      var a = document.getElementById("swym-notification"),
                          b = a.getAttribute("data-tab-et"),
                          a = a.getAttribute("data-tab");
                      b && Fa(b);
                      e({ originInstrument: l.Instrumentations.UIOpenFromNotification, tab: a });
                  }, 100);
              }
              function Fa(a) {
                  var b = l.getRelayFilters(),
                      c;
                  for (c in b)
                      if (a == b[c]) {
                          l.storage.set("currentFilter", c);
                          break;
                      }
              }
              function za() {
                  t(!0);
                  setTimeout(function () {
                      var a = document.getElementById("swym-santa"),
                          b = a.getAttribute("data-tab-et"),
                          a = a.getAttribute("data-tab");
                      if (b) {
                          var c = l.getRelayFilters(),
                              d;
                          for (d in c)
                              if (b == c[d]) {
                                  l.storage.set("currentFilter", d);
                                  break;
                              }
                      }
                      e({ originInstrument: l.Instrumentations.UIOpenFromNotification, tab: a });
                  }, 100);
              }
              function na(a, b) {
                  l.api.deleteEvent(function () {}, b, a);
                  ta(b);
              }
              function ta(a) {
                  if ((a = document.getElementById(a))) {
                      var b = a.parentNode;
                      b.removeChild(a);
                      X(b.children.length);
                  }
              }
              function Aa(a) {
                  return function (b, c) {
                      0 < (b.hashtags || []).length
                          ? (document.getElementById(c),
                            l.api.removeCollectionsFromProduct(b.epi, [a], function () {
                                SwymUtils.log(b.epi + " - Hashtag removed - " + a);
                            }),
                            ta(c))
                          : na(b, c);
                  };
              }
              function ua(a, b) {
                  return function (c) {
                      l.instrument(a, { epi: b.epi });
                  };
              }
              function Ba(a, b) {
                  return function (c) {
                      l.migrateErrorProduct(a);
                      l.triggerSwymEvent(f.JSEvents.productImageError, a, b);
                  };
              }
              function va() {
                  var a = document.getElementById("swym-notepad").offsetHeight;
                  if (a) {
                      var b = SwymUtils.viewport();
                      650 > b.width && (a = b.height - 30);
                      var c = document.getElementById("swym-notepad-header").offsetHeight,
                          d = document.getElementById("swym-tabs-nav").offsetHeight + document.getElementById("swym-tabs-toolbar").offsetHeight;
                      document.getElementById("swym-tabs-content").style.height = a - (c + d) + "px";
                      if ((a = document.getElementById("swym-tab-modal"))) (c = a.offsetHeight), 650 > b.width && (c = b.height - 180), (a.style.height = c + "px");
                      SwymUtils.isTouchDevice() && document.activeElement && "INPUT" == document.activeElement.tagName && document.activeElement.scrollIntoViewIfNeeded();
                  }
              }
              function Da(a, b, c, d) {
                  Ga = b;
                  var e = Z,
                      f = { etData: a, loading: !0, showCount: e.HashtagEditorShowCount || !0 },
                      g = SwymUtils.renderTemplate(M.HashtagEditor, f);
                  r(g, "swym-hashtag-editor", !0, {
                      appendTo: "swym-plugin",
                      onRender: function (g) {
                          var h = b.evtElem;
                          b.containerElem = g;
                          g.querySelector(".swym-tab-modal").setAttribute("style", ya(h, 400, 320));
                          l.api.getAllCollections(function (h) {
                              var k = l.getCollectionsForProduct(a.epi),
                                  m = [],
                                  n;
                              for (n in h) m.push({ name: n, nameVal: decodeURIComponent(n), count: (h[n] || []).length, sel: -1 < k.indexOf(n) });
                              (e.HashtagEditorPreset || []).forEach(function (a) {
                                  h[a] || m.push({ name: a, nameVal: decodeURIComponent(a), rs: !0 });
                              });
                              m.sort(
                                  "rsa" == e.HashtagEditorSortOrder
                                      ? function (a, b) {
                                            return a.rs ? 1 : b.rs ? 0 : a.name > b.name ? 1 : 0;
                                        }
                                      : "user" == e.HashtagEditorSortOrder
                                      ? function (a, b) {
                                            return a.count < b.count ? 1 : 0;
                                        }
                                      : function (a, b) {
                                            return a.name > b.name ? 1 : 0;
                                        }
                              );
                              m.unshift({ name: J.Title, nameVal: decodeURIComponent(J.Title), _default: !0 });
                              f.loading = !1;
                              f.hashtags = m;
                              g.querySelector(".swym-tab-modal-content").innerHTML = SwymUtils.renderTemplate(M.HashtagEditor, f);
                              var p = document.querySelector("#swym-hashtageditor");
                              SwymUtils.addEvent(p, "submit", function (a) {
                                  a.preventDefault();
                                  p.querySelector(".swym-hashtageditor-ok button").click();
                              });
                              SwymUtils.addEvent(p.querySelector(".swym-hashtageditor-create-action button"), "click", function (a) {
                                  a.preventDefault();
                                  a.stopPropagation();
                                  a = SwymUtils.renderTemplate(M.HashtagCreate, {});
                                  var b = document.createElement("div");
                                  b.innerHTML = a;
                                  a = b.children[0];
                                  p.querySelector(".swym-hashtageditor-list").appendChild(a);
                                  var c = a.querySelector('input[type="text"]'),
                                      d = a.querySelector('input[type="checkbox"]');
                                  a = SwymUtils.debounce(function () {
                                      var a = c.value;
                                      d.value = a;
                                      3 < a.length && SwymUtils.removeClass(d.parentElement, "swym-error");
                                  }, 10);
                                  SwymUtils.addEvent(c, "input", a);
                                  SwymUtils.addEvent(c, "change", a);
                                  SwymUtils.addEvent(c, "keydown", a);
                                  SwymUtils.addEvent(d, "change", function (a) {
                                      if (!a.currentTarget.checked) {
                                          var b = !1;
                                          p.reportValidity && (b = p.reportValidity());
                                          b || ((a = a.currentTarget.parentElement), a.parentElement.removeChild(a));
                                      }
                                  });
                                  c.focus();
                              });
                              SwymUtils.addEvent(p.querySelector(".swym-hashtageditor-cancel button"), "click", function (c) {
                                  c.preventDefault();
                                  c.stopPropagation();
                                  c = a.hashtags || [];
                                  w();
                                  d(a, c, b);
                              });
                              SwymUtils.addEvent(p.querySelector(".swym-hashtageditor-ok button"), "click", function (d) {
                                  d.preventDefault();
                                  d.stopPropagation();
                                  if (!p.reportValidity || p.reportValidity()) {
                                      d = p.querySelectorAll('.swym-hashtageditor-list input[type="checkbox"]');
                                      for (var e = [], f = 0; f < d.length; f++) {
                                          var g = d[f];
                                          if (g.checked && !g.disabled)
                                              if (g.value) f >= m.length ? e.push(encodeURIComponent(g.value)) : e.push(g.value);
                                              else {
                                                  SwymUtils.addClass(g.parentElement, "swym-error");
                                                  g.previousElementSibling.focus();
                                                  return;
                                              }
                                      }
                                      a.hashtags = e;
                                      w();
                                      c(a, e, b);
                                  }
                              });
                          });
                      },
                      onDismiss: function () {
                          d(a, a.hashtags || [], b);
                      },
                  });
              }
              function ya(a, b, c) {
                  a = SwymUtils.modalPosition(a, 400, 320);
                  return SwymUtils.renderTemplate(M.PositionAttr, a);
              }
              var l = null,
                  wa,
                  Ja,
                  Ka,
                  ra = !0,
                  Ia,
                  M,
                  q,
                  ea,
                  Ca,
                  Ha,
                  pa,
                  J,
                  Z,
                  N;
              this.SwymUI = function (a) {
                  this.hasUiInitalized = !1;
                  var b = {};
                  a && "object" === typeof a && (this.options = SwymUtils.extendDefaults(b, a));
                  d();
              };
              SwymUI.prototype.open = function (a) {
                  a = a || {};
                  l.exemptDevice();
                  var b = document.getElementById("swym-plugin");
                  Ia && SwymUtils.removeClass(b, "swym-nt-" + Ia.nt);
                  e(a);
              };
              SwymUI.prototype.setEtAsCurrentFilter = function (a) {
                  Fa(a);
              };
              SwymUI.prototype.initCustomLaunchPoints = function () {
                  SwymUtils.forEachElement('a[href="#swym-wishlist"]', function (a) {
                      SwymUtils.addEvent(a, "click", function (a) {
                          a.preventDefault();
                          window._swat.ui.open();
                      });
                  });
              };
              SwymUI.prototype.turnOffPopup = function () {
                  this.open = function () {
                      console.warn("Popup turned off");
                  };
              };
              window._openModal = SwymUI.prototype.open;
              window.swymRenderUIAnchor = function () {
                  try {
                      F();
                  } catch (a) {
                      SwymUtils.warn("Error on swymRenderUIAnchor, old code");
                  }
              };
              window.setupUX = function () {
                  try {
                      window._swat.setNotificationUX(h);
                  } catch (a) {
                      SwymUtils.warn("Error on setupUX, old code");
                  }
              };
              SwymUI.prototype.close = function (a) {
                  g(a);
              };
              SwymUI.prototype.changeTab = function (a) {
                  u(a);
              };
              SwymUI.prototype.openProductDetails = function (a, b, c) {
                  v({ uri: b, epi: a, onlyCurrentProduct: !0, appendTo: "swym-plugin" });
              };
              SwymUI.prototype.openProductSwiper = function (a) {
                  a.appendTo || (a.appendTo = "swym-plugin");
                  v(a);
              };
              SwymUI.prototype.jumpToTab = function (a) {
                  Fa(a);
                  qa();
              };
              SwymUI.prototype.openNotification = function (a, b) {
                  h(a, b);
              };
              SwymUI.prototype.closeNotification = function (a) {
                  p(a);
              };
              SwymUI.prototype.showToast = function (a) {
                  P(a);
              };
              SwymUI.prototype.openSanta = function (a, b) {
                  n(a, b);
              };
              SwymUI.prototype.closeSanta = function (a) {
                  t();
              };
              SwymUI.prototype.refreshProducts = SwymUtils.debounce(
                  function (a) {
                      a && l.productCache.makeCacheEntryStale();
                      if ((a = document.querySelector("#swym-item-filter .is-active a"))) {
                          a = a.getAttribute("data-id");
                          var b = l.storage.get("currentFilter") || q.AllFilter;
                          aa(b, a);
                      } else SwymUtils.warn("UI not ready");
                  },
                  300,
                  5
              );
              SwymUI.prototype.onStylesLoaded = function () {
                  "complete" == document.readyState
                      ? setTimeout(function () {
                            SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                                SwymUtils.addClass(a, "swym-ready");
                            });
                        }, 100)
                      : window.addEventListener("load", function () {
                            SwymUtils.forEachElement("#swym-plugin, #swym-hosted-plugin", function (a) {
                                SwymUtils.addClass(a, "swym-ready");
                            });
                        });
              };
              SwymUI.prototype.disable = function () {
                  e = ma = function () {};
              };
              SwymUI.prototype.openRemindMe = function (a, b, d, e) {
                  c(a, b, d, e);
              };
              SwymUI.prototype.openGetTriggerPermissionDialog = function (a, c) {
                  b(a, c);
              };
              SwymUI.prototype.toggleShareWishlistSocialUi = function (b, c, d, e) {
                  a(b, c, d, e);
              };
              SwymUI.prototype.openHashtagEditor = function (a, b, c, d) {
                  Da(a, b, c, d);
              };
              SwymUI.prototype.showWishlistAnimation = function () {};
              var Ga,
                  Ea = SwymUtils.debounce(function () {
                      if (Ga && Ga.containerElem) {
                          var a = Ga.evtElem;
                          Ga.containerElem.querySelector(".swym-tab-modal").setAttribute("style", ya(a, 400, 320));
                      }
                  }, 100);
              window.addEventListener("resize", Ea, !1);
          })();
          v.push({
              id: "render",
              events: { renderedProductItem: "swui:renderedproductitem" },
              cfg: {
                  UI: {
                      Color: "",
                      CustomCSS: "",
                      DefaultFilter: "",
                      DisplayMode: "sidebar",
                      DisallowedURLPatterns: ["checkout"],
                      Enabled: !1,
                      EnableProductView: !0,
                      HideAllFilter: !1,
                      Icon: "",
                      LauncherLocation: "bottom-right",
                      LauncherType: "floating",
                      LauncherButtonType: "",
                      LauncherIcon: "",
                      LaunchFrom: "right",
                      NotificationOnly: !1,
                      NoWelcomeScreen: !1,
                      SimpleWishlistOnly: !1,
                      Subtitle: "",
                      Title: "",
                      UseCustomLauncher: !1,
                      WelcomeSplash: "",
                      GridPagedRender: !1,
                      GridPageSize: 8,
                  },
              },
              init: function () {
                  this.evtLayer.addEventListener(this.JSEvents.preReadSettings, function (a) {
                      if ((a = a.detail.d.settings) && 2 != a.General._v && a.RelayUI) {
                          var b = a.UI || {},
                              c = a.General,
                              d = a.RelayUI,
                              e = a.Wishlist,
                              f = a.Watchlist,
                              h = a.Strings;
                          [{ o: "EnableSwymRelay", n: "Enabled" }].forEach(function (a) {
                              SwymUtils.isUndefined(c[a.o]) || ((c[a.n] = c[a.o]), delete c[a.o]);
                          });
                          [{ o: "EnableRelayUI", n: "Enabled" }].forEach(function (a) {
                              SwymUtils.isUndefined(c[a.o]) || ((b[a.n] = c[a.o]), delete c[a.o]);
                          });
                          [
                              { o: "Title", n: "Title" },
                              { o: "Color", n: "Color" },
                              { o: "CustomCSS", n: "CustomCSS" },
                              { o: "DisallowedURLPatterns", n: "DisallowedURLPatterns" },
                              { o: "WelcomeSplash", n: "WelcomeSplash" },
                              { o: "NotificationOnly", n: "NotificationOnly" },
                              { o: "EnableProductView", n: "EnableProductView" },
                              { o: "SimpleWishlistOnly", n: "SimpleWishlistOnly" },
                              { o: "NoWelcomeScreen", n: "NoWelcomeScreen" },
                              { o: "DefaultFilter", n: "DefaultFilter" },
                              { o: "DisplayMode", n: "DisplayMode" },
                              { o: "HideAllFilter", n: "HideAllFilter" },
                              { o: "LaunchFrom", n: "LaunchFrom" },
                              { o: "LauncherLocation", n: "LauncherLocation" },
                              { o: "LauncherType", n: "LauncherType" },
                              { o: "LauncherButtonType", n: "LauncherButtonType" },
                              { o: "LauncherOpenHosted", n: "LauncherOpenHosted" },
                              { o: "LauncherIcon", n: "LauncherIcon" },
                              { o: "CustomIcon", n: "CustomIcon" },
                              { o: "UseCustomLauncher", n: "UseCustomLauncher" },
                              { o: "CustomAnchorSelector", n: "CustomAnchorSelector" },
                              { o: "GridPagedRender", n: "GridPagedRender" },
                              { o: "GridPageSize", n: "GridPageSize" },
                          ].forEach(function (a) {
                              SwymUtils.isUndefined(d[a.o]) || (b[a.n] = d[a.o]);
                          });
                          [
                              { o: "AddToCartCTA", n: "AddToCartCTA" },
                              { o: "SoldOutCTA", n: "SoldOutCTA" },
                              { o: "SoldOutCTA", n: "SoldOutCTA" },
                              { o: "UnavailableCTA", n: "UnavailableCTA" },
                              { o: "addedCTA", n: "AddedToCartCTA" },
                              { o: "WelcomeMessage", n: "WelcomeMessage" },
                              { o: "WelcomeTitle", n: "WelcomeTitle" },
                              { o: "WelcomeCTA", n: "WelcomeCTA" },
                          ].forEach(function (a) {
                              SwymUtils.isUndefined(d[a.o]) || ((Sa[a.n] = d[a.o]), SwymUtils.isUndefined(h[a.n]) && (h[a.n] = d[a.o]));
                          });
                          [
                              { o: "FavoritesCTA", n: "WishlistAddCTA" },
                              { o: "AddedCTA", n: "WishlistAddedCTA" },
                              { o: "TooltipBefore", n: "WishlistTooltipBefore" },
                              { o: "TooltipAfter", n: "WishlistTooltipAfter" },
                          ].forEach(function (a) {
                              SwymUtils.isUndefined(e[a.o]) || ((Ba[a.n] = e[a.o]), SwymUtils.isUndefined(h[a.n]) && (h[a.n] = e[a.o]), delete e[a.o]);
                          });
                          [
                              { o: "CTA", n: "WatchlistAddCTA" },
                              { o: "Tooltip", n: "WatchlistTooltip" },
                              { o: "AddToMailingListText", n: "AddToMailingListText" },
                          ].forEach(function (a) {
                              SwymUtils.isUndefined(f[a.o]) || ((Ba[a.n] = f[a.o]), SwymUtils.isUndefined(h[a.n]) && (h[a.n] = f[a.o]), delete f[a.o]);
                          });
                          b.Subtitle = b.Subtitle;
                          a.UI = b;
                          delete a.RelayUI;
                      }
                  });
              },
          });
          $templateCache_bodyhtml =
              '<style>#swym-plugin {display: none;}.swym-tooltip{display: none;}</style><div id="swym-plugin"><script id="swym-product-template" type="x-tmpl-mustache"><div class="swym-outer">\n            <div class="swym-inner">\n                <div class="swym-image">\n                    <a href="{{du}}" class="swym-redirect swym-vertical-middler">\n                        {{#iu}}\n                        <div class="swym-vertical-middler-cell">\n                          <img src="{{iu}}" alt="{{dt}}"/>\n                        </div>\n                        {{/iu}}\n                        {{^iu}}\n                        <span class="swym-image-placeholder">\n                        </span>\n                        {{/iu}}\n                    </a>\n                </div>\n                <div class="swym-information">\n                    <div class="swym-title" role="complementary">\n                        <a href="{{du}}">{{dt}}</a>\n                    </div>\n                    <div class="swym-price swym-text-color">\n                        <span class="swym-old">{{#op}}{{cu}} {{op}}{{/op}}</span> {{cu}} {{pr}}\n                    </div>\n                </div>\n                <div class="swym-add-to-cart swym-background-color swym-loader">\n                  <a href="#">{{addToCartCTA}}</a>\n                </div>\n                <ul class="swym-actions">\n                    <li class="swym-wishlist{{#inwishlist}} is-active{{/inwishlist}}">\n                        <a href="#">\n                            <i class="swym-icon swym-heart-grey"></i>\n                        </a>\n                    </li>\n                    <li class="swym-cart{{#incart}} is-active{{/incart}}">\n                        <a href="#">\n                            <i class="swym-icon swym-cart-grey"></i>\n                        </a>\n                    </li>\n                    <li class="swym-remove">\n                        <a href="#">\n                            <i class="swym-icon swym-close-grey"></i>\n                        </a>\n                    </li>\n                </ul>\n                <a class="swym-link" href="{{du}}"></a>\n            </div>\n        </div>\x3c/script><script id="swym-toast-template" type="x-tmpl-mustache"><div class="swym-innr">\n            <div id="swym-notification-header" class="swym-notification-header swym-background-color">\n                <i class="swym-icon swym-alert-white"></i>\n                <strong id="swym-notification-title" class="swym-title" role="complementary">\n                    <a href="{{du}}" class="swym-redirect"><span>{{^msg}}{{{hdr}}}{{/msg}}{{#msg}}{{{msg}}}{{/msg}}</span></a>\n                </strong>\n                <a class="swym-close" href="#" id="swym-close-notification-button">\n                    <i class="swym-icon swym-close-white"></i>\n                </a>\n            </div>\n            <div class="swym-notification-content" id="swym-notification-content">\n                <div class="swym-item clearfix" data-swym-et="{{et}}">\n                    <div class="swym-inner">\n                        <div class="swym-image">\n                            <a href="{{du}}" class="swym-redirect swym-vertical-middler">\n                                {{#iu}}\n                                <div class="swym-vertical-middler-cell">\n                                  <img src="{{iu}}" alt="{{dt}}"/>\n                                </div>\n                                {{/iu}}\n                                {{^iu}}\n                                <span class="swym-image-placeholder">\n                                </span>\n                                {{/iu}}\n                            </a>\n                        </div>\n                        <div class="swym-information">\n                            <div class="swym-title" role="complementary">\n                                <a href="{{du}}" class="swym-redirect">{{dt}}</a>\n                                {{^pg}}\n                                <div class="swym-variantinfo">{{vinfo}}</div>\n                                {{/pg}}\n                            </div>\n                            {{#pr}}\n                            <div class="swym-price">\n                                <span class="swym-old">{{#op}}{{cu}} {{op}}{{/op}}</span> {{cu}} {{pr}}\n                            </div>\n                            {{/pr}}\n                        </div>\n                    </div>\n                </div>\n\n                <a href="javascript:void(0);" class="swym-view-history">__ViewHistoryCTA__</a>\n\n                <div class="swym-powered-by">\n                    <a href="https://swym.it?utm_medium=notification&utm_source=poweredby" target="_blank">Powered By Swym</a>\n                </div>\n            </div>\n        </div>\x3c/script><script id="swym-settings-auth-template" type="x-tmpl-mustache"><div class="swym-auth" id="swym-auth">\n          <p class="swym-auth-description">__SettingsConnectDescription__</p>\n          <form action="#" id="swym-email-auth-form">\n              <input type="email" name="swym-email-auth" aria-label="Email Auth Input" id="swym-email-auth-input" class="swym-input" placeholder="__EnterEmailPlaceholder__"{{#authn}} value="{{email}}" disabled="disabled"{{/authn}} novalidate />\n              <button type="button" id="swym-email-auth-button" class="swym-button swym-background-color swym-loader {{^authn}}connect{{/authn}}{{#authn}}disconnect{{/authn}}">\n                {{^authn}}\n                    __SettingsConnectCTA__\n                {{/authn}}\n                {{#authn}}\n                    __SettingsDisconnectCTA__\n                {{/authn}}\n              </button>\n          </form>\n          <div id="swym-email-auth-message"></div>\n      </div>\x3c/script><script id="swym-gen-toast-template" type="x-tmpl-mustache"><div class="swym-inner">\n            <div id="swym-toast-container" class="swym-toast-bottom-right" aria-live="polite" role="alert">\n                <div class="swym-toast swym-background-color">\n                    <div class="swym-toast-message">{{{message}}}</div>\n                </div>\n            </div>\n        </div>\x3c/script><script id="swym-welcome-template" type="x-tmpl-mustache"><div class="swym-welcome-container">\n            <strong class="swym-text-color">{{{STRINGS.WelcomeTitle}}}</strong>\n            <p>{{{STRINGS.WelcomeMessage}}}</p>\n            <button type="button" class="swym-button swym-background-color" id="swym-welcome-button">{{{STRINGS.WelcomeCTA}}}</button>\n        </div>\x3c/script><script id="swym-social-share-template" type="x-tmpl-mustache"><div class="swym-social-share-container" id="swym-social-share-container">\n            <div class="swym-email-popup-message" id="swym-social-share-message"></div>\n            <h2 class="share-title">{{{STRINGS.ShareSocialDialogTitle}}}</h2>\n            <div class="swym-information">\n              <textarea class="swym-input social-share-string" id="swym-social-share-string" value="" ></textarea>\n              <div class="share-platform-options">\n                {{#shareOptions}}\n                <span style="background-image:url(\'{{iconurl}}\')" class="share-option share-through-{{type}}">\n                    <a class="share-link" data-type="{{type}}" data-url="{{url}}" href="#"></a>\n                </span>\n                {{/shareOptions}}\n                <span style="background-image:url(\'{{shareWithEmailIconUrl}}\')" class="share-option share-through-email">\n                    <a class="share-link" id="swym-share-with-email-container-toggle" data-type="email" href="#"></a>\n                </span>\n              </div>\n            </div>\n            <hr>\n        </div>\n        <div id="swym-no-authentication-share-container" class="swym-no-authentication-container align-center hide-container">\n          <h2 class="share-title">{{{STRINGS.ShareLoginReqdDesc}}}</h2>\n          <div class="actions">\n            {{#showSiteLogin}}\n            <button type="button" id="swym-login-for-share-button" class="swym-button swym-background-color swym-loader">\n              {{{STRINGS.ShareLoginCTA}}}\n            </button>\n            {{/showSiteLogin}}\n\n            {{#showConnect}}\n            <button type="button" id="swym-connect-for-share-button" class="swym-button swym-background-color swym-loader">\n              {{{STRINGS.ShareConnectCTA}}}\n            </button>\n            {{/showConnect}}\n          </div>\n        </div>\x3c/script><script id="swym-remind-me" type="x-tmpl-mustache"><div class="swym-remind-me swym-product-view swym-product-view-swiper">\n          <div class="clearfix">\n              <div class="swym-title" role="complementary">\n                  <h2>__WatchlistAddCTA__</h2>\n              </div>\n              <div class="swym-information">\n                <div class="swym-remind-auth" id="swym-remind-auth">\n                    <p class="swym-remind-description" title="{{message}}" role="complementary" aria-label="Email Description">{{message}}<p>\n                    <div class="swym-remind-auth-form-container" role="form" aria-label="Remind Form Container">\n                      <form action="#" id="swym-remind-auth-form">\n                          <input type="email" name="swym-remind-email-auth" id="swym-remind-email-auth-input" class="swym-input" aria-label="__EnterEmailPlaceholder__" placeholder="__EnterEmailPlaceholder__" value="{{email}}"/>\n                          {{#showVariantSelector}}\n                            <div class="swym-options clearfix" role="form">\n                              <div class="swym-option">\n                                  <select class="swym-select is-required" id="swym-remind-me-oos-options" aria-label="Variant Selector">\n                                      {{#oosOptions}}\n                                        <option value="{{id}}">{{variantString}}</option>\n                                      {{/oosOptions}}\n                                  </select>\n                              </div>\n                            </div>\n                          {{/showVariantSelector}}\n                          {{#showSMSInput}}\n                            <p class="swym-remind-description swym-sms-input" role="complementary" aria-label="SMS Description">{{ISASMSDesc}}</p>\n                            <div class="swym-contact-container">\n                                <input type="text" name="swym-remind-sms" id="swym-remind-sms-input" class="swym-input" placeholder="{{contactNoPlaceHolder}}" value="{{contactNo}}"/>\n                                <button class="contact-validation">{{contactNoActionString}}</button>\n                            </div>\n                          {{/showSMSInput}}\n                          {{#showWebpushCheckbox}}\n                            <div class="swym-remind-me-mailing-list-container">\n                              <input id="swym-remind-me-webpush-input" type="checkbox"  /><label for="swym-remind-me-webpush-input" class="mailing-list-text"><p>__ISASubscribeWebpush__</p></label>\n                            </div>\n                          {{/showWebpushCheckbox}}\n                          <button type="button" id="swym-remind-email-auth-button" class="swym-button swym-green swym-loader">__ISASubscribeCTA__</button>\n                          {{#showMailingListCheckbox}}\n                            <div class="swym-remind-me-mailing-list-container">\n                              <input id="swym-remind-me-add-to-mailing-list-input" type="checkbox"  /><label for="swym-remind-me-add-to-mailing-list-input" class="mailing-list-text"><p>__ISAAddToMailingList__</p></label>\n                            </div>\n                          {{/showMailingListCheckbox}}\n                      </form>\n                    </div>\n                    <div id="swym-remind-email-auth-message"></div>\n                </div>\n              </div>\n          </div>\n          <div class="swym-privacy-info" role="complementary" aria-label="Privacy Info">__ISAPrivacy__</div>\n          <div class="swym-powered-by">\n              <a href="https://swym.it?utm_medium=notification&utm_source=poweredby" target="_blank">Powered By Swym</a>\n          </div>\n      </div>\x3c/script><script id="swym-remind-me-block" type="x-tmpl-mustache"><div class="swym-remind-me swym-remind-me-block swym-product-view swym-product-view-swiper">\n            <div class="clearfix">\n                <div class="swym-title" role="complementary">\n                    <h2>__WatchlistAddCTA__</h2>\n                </div>\n                <div class="swym-information">\n                    <div class="swym-remind-auth" id="swym-remind-auth">\n                        <p class="swym-remind-description" role="complementary" aria-label="Saved Mediums">{{message}}</p>\n                        {{#showSavedMediums}}\n                            <div class="swym-saved-mediums">\n                                <p>__ReceiveAlerts__</p>\n                                {{#emailAddr}}<span class="swym-saved-email">Email: {{emailAddr}}</span>{{/emailAddr}}\n                                {{#contactNo}}<span class="swym-saved-contact-no">SMS: {{contactNo}}</span>{{/contactNo}}\n                            </div>\n                        {{/showSavedMediums}}\n                        {{#showVariantSelector}}\n                            <div class="swym-options clearfix" role="form">\n                              <div class="swym-option">\n                                  <select class="swym-select is-required" id="swym-remind-me-oos-options" aria-label="Variant Selector">\n                                      {{#oosOptions}}\n                                        <option value="{{id}}">{{variantString}}</option>\n                                      {{/oosOptions}}\n                                  </select>\n                              </div>\n                            </div>\n                        {{/showVariantSelector}}\n                        {{#showMediumsSwitcher}}\n                            <div class="swym-mediums-switcher" role="form" aria-label="Medium Switcher">\n                                {{#showEmailContainer}}\n                                    <button class="swym-button" id="email-switch">\n                                        <label for="email-switch">{{EmailSwitchLabel}}</label>\n                                    </button>\n                                {{/showEmailContainer}}\n                                {{#showSMSContainer}}\n                                    <button class="swym-button non-active" id="sms-switch">\n                                        <label for="sms-switch">{{SMSSwitchLabel}}</label>\n                                    </button>\n                                {{/showSMSContainer}}\n                                {{#showWebpushCheckbox}}\n                                    <button class="swym-button non-active" id="webpush-switch">\n                                        <label for="webpush-switch">{{WebpushSwitchLabel}}</label>\n                                    </button>\n                                {{/showWebpushCheckbox}}\n                            </div>\n                        {{/showMediumsSwitcher}}\n                        {{#showEmailContainer}}\n                            <div class="swym-remind-email-container" role="form" aria-label="Email Form">\n                                <div class="swym-remind-email-inputs">\n                                    <div class="swym-input-and-error-container">\n                                        <input type="email" name="swym-remind-email-auth" id="swym-remind-email-auth-input" aria-label="__EnterEmailPlaceholder__" class="swym-input" placeholder="__EnterEmailPlaceholder__" value=""></input>\n                                    </div>\n                                    <button class="swym-button email-sub-button subscribe-button">{{EmailMeCTA}}</button>\n                                </div>\n                                {{#showMailingListCheckbox}}\n                                    <div class="swym-remind-me-mailing-list-container swym-add-to-mailing-checkbox">\n                                        <input id="swym-remind-me-add-to-mailing-list-input" type="checkbox" /><label for="swym-remind-me-add-to-mailing-list-input" class="mailing-list-text"><p>__ISAAddToMailingList__</p></label>\n                                    </div>\n                                {{/showMailingListCheckbox}}\n                            </div>\n                        {{/showEmailContainer}}\n                        {{#showSMSContainer}}\n                        <div class="swym-remind-sms-container" style="display:none;">\n                            <div class="swym-input-and-error-container">\n                                <input type="text" name="swym-remind-sms" id="swym-remind-sms-input" class="swym-input" placeholder="{{contactNoPlaceHolder}}" value="{{contactNo}}"/>\n                            </div>\n                            <button class="swym-button sms-sub-button subscribe-button">{{SMSCTA}}</button>\n                        </div>\n                        {{/showSMSContainer}}\n                        {{#showWebpushCheckbox}}\n                        <div class="swym-remind-me-mailing-list-container swym-webpush" style="display:none;">\n                            <label for="swym-remind-me-webpush-input" class="mailing-list-text"><p>__ISASubscribeWebpush__</p></label>\n                            <button class="swym-button webpush-sub-button subscribe-button">{{WebpushCTA}}</button>\n                        </div>\n                        {{/showWebpushCheckbox}}\n                        {{#showCommonSubscribeBtn}}\n                            <button class="swym-button swym-common-sub-button swym-horizontal-center swym-full-width">__ISASubscribeCTA__</button>\n                        {{/showCommonSubscribeBtn}}\n                    </div>\n                </div>\n            </div>\n            <div class="swym-privacy-info" aria-label="Privacy Info" role="complementary">__ISAPrivacyGeneric__</div>\n            <div class="swym-powered-by">\n                <a href="https://swym.it?utm_medium=notification&utm_source=poweredby" target="_blank">Powered By Swym</a>\n            </div>\n        </div>\x3c/script><script id="swym-get-trigger-permission-template" type="x-tmpl-mustache"><div class="swym-remind-me swym-product-view swym-product-view-swiper" style="{{PopupBodyStyleString}}">\n          <div class="clearfix">\n              <div class="swym-title" role="complementary">\n                  <h2>{{{PopupTitle}}}</h2>\n              </div>\n              <div class="swym-information">\n                <div class="swym-remind-auth" id="swym-remind-auth">\n                    <p class="swym-remind-description" role="complementary" aria-label="Remind Description">{{PopupDesc}}<p>\n                    <div class="swym-remind-auth-form-container" role="form" aria-label="Trigger Form">\n                      <form action="#" id="swym-trigger-auth-form">\n                          <input type="email" name="swym-trigger-email-auth" aria-label="{{{STRINGS.GetTriggerPermissionEmailPlaceholder}}}" id="swym-trigger-email-auth-input" class="swym-input" placeholder="{{{STRINGS.GetTriggerPermissionEmailPlaceholder}}}" value="{{email}}"/>\n                          {{#showRemindWishlistCheckbox}}\n                            <div class="swym-remind-me-mailing-list-container">\n                              <input id="swym-trigger-remind-wishlist-input" type="checkbox" checked="true" /><label for="swym-trigger-remind-wishlist-input" class="mailing-list-text"><p>{{{STRINGS.WishlistAlertString}}}</p></label>\n                            </div>\n                          {{/showRemindWishlistCheckbox}}\n                          {{#showMailingListCheckbox}}\n                            <div class="swym-remind-me-mailing-list-container">\n                              <input id="swym-trigger-add-to-mailing-list-input" type="checkbox"  /><label for="swym-trigger-add-to-mailing-list-input" class="mailing-list-text"><p>{{{STRINGS.GetTriggerPermissionMailingListCheck}}}</p></label>\n                            </div>\n                          {{/showMailingListCheckbox}}\n                          <button\n                            type="button"\n                            id="swym-trigger-email-auth-button"\n                            class="swym-button swym-green swym-loader"\n                            style="{{ButtonStyleString}}"\n                          >\n                            {{{STRINGS.GetSaveWishlistCTA}}}\n                          </button>\n                          {{#showDenyButton}}\n                            <a id="swym-trigger-email-auth-deny">{{{STRINGS.GetTriggerPermissionDenyCTA}}}</a>\n                          {{/showDenyButton}}\n                      </form>\n                    </div>\n                    <div id="swym-trigger-auth-message"></div>\n                </div>\n              </div>\n          </div>\n          <div class="swym-privacy-info" aria-label="Privacy Info" role="complementary">{{{STRINGS.GetTriggerPermissionPrivacyInfo}}}</div>\n      </div>\x3c/script><script id="swym-get-trigger-permission-opt-in-template" type="x-tmpl-mustache"><div class="swymPopupHeading">\n            <img src={{{StoreLogo}}}></img>\n        </div>\n        <div class="swymPopupBody">\n            <div class="swymPopupDescription">\n                <h2>{{OptinFormTitle}}</h2>\n                <h4>{{OptinFormDesc}}</h4>\n            </div>\n            <div class="swymPopupInputs">\n                <input type="text" placeholder="{{{STRINGS.EmailInputPlaceHolder}}}"></input>\n                <button class="swymSubButton">{{{STRINGS.SubscribeButton}}}</button>\n            </div>\n            <div class="swymPopupStatusMsg">\n            </div>\n            <div class="swymPopupFooter">\n                {{#showSMSOptIn}}\n                    <a class="swymTMMediumSwitch">{{{STRINGS.OptInForSMS}}}</a>\n                {{/showSMSOptIn}}\n                \x3c!-- <a>{{{STRINGS.TermsAndPrivacy}}}</a> --\x3e\n            </div>\n        </div>\x3c/script><script id="swym-product-view-template" type="x-tmpl-mustache"><div class="swym-product-view">\n            <div class="clearfix">\n                <div class="swym-title" role="complementary">\n                    <h2><a href="{{url}}">{{title}}</a></h2>\n                    <span class="swym-category swym-text-color">{{type}}</span>\n                </div>\n                <div class="swym-image">\n                    <a href="{{chosenVariantUrl}}"  class="swym-redirect swym-vertical-middler">\n                        {{#iu}}\n                        <div class="swym-vertical-middler-cell">\n                          <img src="{{iu}}" alt="{{dt}}"/>\n                        </div>\n                        {{/iu}}\n                        {{^iu}}\n                        <span class="swym-image-placeholder">\n                        </span>\n                        {{/iu}}\n                    </a>\n                </div>\n                <div class="swym-information">\n                    <form action="/cart/add" method="post" enctype="multipart/form-data">\n                        <div class="swym-options clearfix" role="form">\n                        {{#optionsSorted}}\n                            {{#.}}\n                                <div class="swym-option">\n                                    <label for="{{name}}">{{name}}</label>\n                                    <select class="swym-select is-required" id="{{name}}" data-position="{{position}}">\n                                        {{#values}}\n                                        {{#.}}\n                                        <option value="{{.}}">{{.}}</option>\n                                        {{/.}}\n                                        {{/values}}\n                                    </select>\n                                </div>\n                            {{/.}}\n                        {{/optionsSorted}}\n                        </div>\n                        <div class="swym-purchase-container">\n                            <div class="swym-price swym-text-color">\n                                <span class="swym-old">{{#compare_at_price}}{{cu}} {{compare_at_price}}{{/compare_at_price}}</span> {{cu}} {{price}}\n                            </div>\n\n                            <div class="swym-buy">\n                                <button type="submit" class="swym-button swym-background-color swym-loader">{{addToCartCTA}}</button>\n                            </div>\n                        </div>\n                    </form>\n                </div>\n            </div>\n\n            <div class="swym-description">\n                <p>{{{description}}}</p>\n            </div>\n            <div class="swym-more-details">\n                <a class="swym-text-color swym-redirect" href="{{moreDetailsUrl}}">__ProductMoreDetailsCTA__</a>\n              </div>\n        </div>\x3c/script><script id="swym-price-template" type="x-tmpl-mustache"><span class="swym-old">{{#compare_at_price}}{{cu}} {{compare_at_price}}{{/compare_at_price}}</span> {{cu}} {{price}}\x3c/script><script id="swym-santa-template" type="x-tmpl-mustache"><div class="swym-inner">\n            <a href="#">\n                <div class="swym-image swym-background-color">\n                    <i class="swym-icon swym-alert-white"></i>\n                </div>\n                <div class="swym-content">\n                    <p>{{{dt}}}</p>\n                </div>\n            </a>\n        </div>\n        <a href="#" class="swym-close" id="swym-santa-close-button">\n            <i class="swym-icon swym-close-grey"></i>\n        </a>\x3c/script><script id="swym-hashtageditor-template" type="x-tmpl-mustache"><form\n        class="swym-fixed-container swym-hashtageditor {{#loading}}swym-hashtageditor-loading swym-loader swym-loading{{/loading}}"\n        id="swym-hashtageditor">\n      <div class="swym-title" role="complementary">\n        <h3 id="hashtageditor-title">__HashtagEditorTitle__</h3>\n      </div>\n      {{^loading}}\n        <ul class="swym-hashtageditor-list">\n          {{#hashtags}}\n          <li class="swym-hashtageditor-list-item {{#_default}}disabled{{/_default}}">\n            <label {{#_default}}disabled="true"{{/_default}}>\n              <span class="swym-hashtag-title"><span class="swym-hashtag-name">{{nameVal}}</span>{{#showCount}}{{#count}} <span class="swym-hashtag-count">({{count}})</span>{{/count}}{{/showCount}}</span>\n              <input type="checkbox" value="{{{name}}}" {{#_default}} checked="true" disabled="true"{{/_default}} {{#sel}}checked="true"{{/sel}}/>\n            </label>\n          </li>\n          {{/hashtags}}\n        </ul>\n        <div class="swym-hashtageditor-create-action">\n          <button type="submit" class="swym-button">__HashtagCreateCTA__</button>\n        </div>\n        <ul class="swym-hashtageditor-actions">\n          <li class="swym-hashtageditor-cancel"><button type="reset" class="swym-button">__HashtagCancelCTA__</button></li>\n          <li class="swym-hashtageditor-ok"><button type="submit" class="swym-button">__HashtagOKCTA__</button></li>\n        </ul>\n      {{/loading}}\n      </form>\x3c/script><script id="swym-pos-template" type="x-tmpl-mustache">top:{{top}}px; {{#left}} left: {{left}}px; {{/left}}; {{#right}} right: {{right}}px; {{/right}}\x3c/script><script id="swym-hashtag-template" type="x-tmpl-mustache"><li class="swym-hashtageditor-list-item swym-hashtageditor-new-item">\n        <input type="text" required class="swym-input" maxlength="30" minlength="3" placeholder="__HashtagPlaceholder__">\n        <input type="checkbox" checked="true" value=""/>\n      </li>\x3c/script><div id="swym-anchor" role="region"><a href="#" class="swym-background-color" id="notepad-anchor-title">__SATitle__</a></div><div id="swym-notepad" aria-hidden="true"><div id="swym-notepad-header" class="swym-notepad-header swym-background-color"><strong class="swym-title" id="notepad-title">__SATitle__</strong> <span class="swym-tag">__SASubtitle__</span> <a class="swym-close" href="#" id="swym-close-notepad-button" aria-label="Close __SATitle__"><i class="swym-icon swym-close-white"></i></a></div><ul id="swym-tabs-nav" class="swym-tabs-nav"><li data-id="items"><a href="#" aria-label="Product Grid"><i class="swym-icon swym-grid-grey"></i></a></li><li><a id="swym-welcome-open-trigger" href="#" aria-label="Welcome Message"><i class="swym-icon swym-help-grey"></i></a></li><li data-id="settings"><a href="#" aria-label="Open __SATitle__ Settings"><i class="swym-icon swym-settings-grey"></i> <span id="swym-current-user"></span></a></li></ul><ul id="swym-tabs-toolbar"><li data-id="items"><div id="swym-item-toolbar" class="swym-item-toolbar"><ul class="swym-item-filter" id="swym-item-filter"></ul><ul class="swym-item-actions" id="swym-item-actions"><li class="search"><a href="#" id="swym-search-button" aria-label="Open Search"><i class="icon-open swym-icon swym-search-grey"></i> <i class="icon-close swym-icon swym-cross-grey"></i></a><div class="swym-search-container"><form action="#" id="swym-search-form" autocomplete="off"><input type="search" aria-label="Search" name="swym-search" class="swym-input" id="swym-search-input" placeholder="Search my history..."></form></div></li><li class="email"><a href="#" id="swym-email-toggle" aria-label="Open Share"><i class="swym-icon swym-email-grey"></i></a></li><li class="filter"><a href="#" id="swym-item-filter-toggle" aria-label="Filter"><i class="swym-icon swym-arrow-down-grey"></i> <span id="swym-current-filter"></span></a></li></ul><div class="swym-email-popup swym-email-container" id="swym-email-container"><a href="#" class="swym-tab-modal-close" role="navigation" aria-label="Close Share" id="swym-share-modal-close"><i class="swym-icon swym-close-grey"></i></a><div class="swym-share-with-email-container" id="swym-share-with-email-container" role="form"><p class="swym-email-popup-title">__ShareEmailDesc__</p><form action="#" id="swym-email-friend-form"><input id="swym-from-friend-input" aria-label="__FromNamePlaceholder__" class="swym-input from-name" placeholder="__FromNamePlaceholder__" novalidate value="__FromNameDefault__"> <input id="swym-email-friend-input" aria-label="__ToAddressPlaceholder__" class="swym-input to-address" placeholder="__ToAddressPlaceholder__" novalidate><textarea class="swym-input" id="swym-email-note-input" aria-label="Wishlist Note" placeholder="__ShareEmailNotePlaceholder__"></textarea><button type="button" id="swym-email-friend-button" class="swym-button swym-primary-background-color swym-button-primary swym-button-large swym-button-full-width">__ShareEmailCTA__</button></form><div class="swym-email-popup-message" id="swym-email-friend-message"></div></div></div></div></li><li data-id="welcome"></li><li data-id="settings"></li></ul><ul id="swym-tabs-content" class="swym-tabs-content"><li data-id="items" id="swym-items-container"><div class="swym-item-toolbar" id="swym-hashtag-toolbar"><ul class="swym-item-filter swym-hashtag-filter" id="swym-hashtag-filter"></ul><ul class="swym-item-actions" id="swym-hashtag-actions"><li class="filter hashtag-filter"><a href="#" id="swym-hashtag-filter-toggle" aria-label="Filter Hashtags"><i class="swym-icon swym-arrow-down-grey"></i> <span id="swym-current-hashtag"></span></a></li></ul></div><ul id="swym-item-grid" class="swym-item-grid"></ul><div id="swym-no-items" class="swym-no-items" role="complementary" aria-label="No Items"><strong>__NoResultsTitle__</strong><p>__NoResultsText__</p></div></li><li data-id="settings" class="swym-settings-container"><div class="swym-settings-block swym-auth-block"><h3 class="swym-heading" id="swym-devices-heading">__SettingsUserInfo__</h3><p id="swym-user-information-description"></p><div id="swym-auth-container"></div></div></li></ul></div><div id="swym-notification"></div><div id="swym-toast"></div><div id="swym-santa"></div><div id="swym-overlay"></div></div><script id="swym-widget-products-template" type="x-tmpl-mustache"><div class="swym-widget swym-products swym-products-{{render.type}}" id="swym-widget-{{id}}">\n    <style>\n      @media screen and (min-width: 800px) {\n        #swym-widget-{{id}} .swym-product-grid-li {\n          width: {{render.widths.desktop}}%;\n        }\n        #swym-widget-{{id}}.swym-products-grid .swym-product-grid-li:nth-child({{render.cols.desktop}}n+1) {\n          clear: left;\n        }\n      }\n      @media screen and (max-width: 800px) {\n        #swym-widget-{{id}} .swym-product-grid-li {\n          width: {{render.widths.tablet}}%;\n        }\n        #swym-widget-{{id}} .swym-product-grid-li:nth-child({{render.cols.tablet}}n+1) {\n          clear: left;\n        }\n      }\n      @media screen and (max-width: 570px) {\n        #swym-widget-{{id}} .swym-product-grid-li {\n          width: {{render.widths.mobile}}%;\n        }\n        #swym-widget-{{id}}.swym-products-grid .swym-product-grid-li:nth-child({{render.cols.mobile}}n+1) {\n          clear: left;\n        }\n      }\n    </style>\n    <ul class="swym-products-loop"></ul>\n    {{#render.iscarousel}}\n    <div class="swym-products-nav">\n      <a class="swym-products-nav-btn swym-products-nav-left" href="#"><i class="swym-icon swym-arrow-left-grey"></i></a>\n      <a class="swym-products-nav-btn swym-products-nav-right" href="#"><i class="swym-icon swym-arrow-right-grey"></i></a>\n    </div>\n    {{/render.iscarousel}}\n  </div>\x3c/script><script id="swym-product-grid-item-template" type="x-tmpl-mustache"><div class="swym-product-grid-item">\n        <div class="swym-product-grid-overlay">\n            <div class="swym-v-align-outer">\n                <div class="swym-v-align-inner">\n                    <p>__DeleteDescription__</p>\n                    <p>__DeleteConfirm__</p>\n                    <div>\n                        <button type="button" class="swym-button no swym-primary-color">__No__</button>\n                        <button type="button" class="swym-button swym-primary swym-primary-background-color yes">__Yes__</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <a href="{{du}}" title="{{dt}}" class="swym-product-grid-hyperlink">\n          {{#renderedDiff}}\n              <span class="swym-product-grid-featured">\n                  <i class="swym-star-icon"></i>\n              </span>\n          {{/renderedDiff}}\n          <div class="swym-product-grid-meta">\n              <span><i class="{{#inwishlist}}swym-heart-icon{{/inwishlist}}\n                {{#viewed}}swym-viewed-icon{{/viewed}}\n                {{#incart}}swym-cart-icon{{/incart}}"></i></span>\n          </div>\n          <div class="swym-product-grid-image">\n              <div class="swym-product-grid-image-placeholder">\n                  <span class="swym-v-align-outer">\n                      {{#iu}}\n                      <span class="swym-v-align-inner">\n                          <img src="{{iu}}" alt="{{dt}}" itemprop="image"/>\n                      </span>\n                      {{/iu}}\n                      {{^iu}}\n                      <span class="swym-image-placeholder">\n                      </span>\n                      {{/iu}}\n                  </span>\n              </div>\n          </div>\n          <div class="swym-product-grid-info">\n              <strong>{{dt}}</strong>\n              <span>{{vinfo}}</span>\n          </div>\n          <div class="swym-product-grid-price">\n              {{#topic}}<span class="topic-update {{topic}}"><i class="swym-{{topic}}-icon"></i> <span>{{{renderedDiff}}}</span></span>{{/topic}}\n              <span>{{#op}}<s class="swym-op">{{cu}}{{op}}</s> {{/op}}<strong class="swym-pr">{{cu}}{{pr}}</strong></span>\n          </div>\n          <div class="swym-product-grid-rating"></div>\n        </a>\n        <div class="swym-product-grid-actions">\n            <button type="button" class="swym-button swym-add-to-cart action swym-primary-border-color swym-primary-color">\n              {{#incart}}__AddedToCartCTA__{{/incart}}\n              {{^incart}}__AddToCartCTA__{{/incart}}\n            </button>\n\n            <button type="button" class="swym-button delete swym-primary-color swym-icon-in-btn">Delete<i class="swym-delete-icon"></i></button>\n        </div>\n    </div>\x3c/script>';
          var ia;
          window.SwymViewProducts || (window.SwymViewProducts = {});
          window.SwymWatchProducts || (window.SwymWatchProducts = {});
          window.SwymProductVariants || (window.SwymProductVariants = {});
          var X,
              V,
              La,
              gb = !1,
              sb = !1,
              w,
              z,
              ja = !1,
              kb = !1,
              hb,
              la,
              U,
              B;
          f.prototype.injectSwymButtonOnProductGrid = SwymUtils.debounce(function () {
              if (U) {
                  var a = h.retailerSettings.Wishlist.ProductGridButton;
                  if (a) {
                      var b = h.getApp("Wishlist"),
                          c = h.getApp("ShoppingAssistant"),
                          d = a.Enabled;
                      if ((b && b.enabled && d) || (c && c.enabled && d)) {
                          var e = a.attachButtonSelector,
                              c = U.productTileSelector,
                              f = a.iconType;
                          SwymUtils.forEachElement(c, function (a) {
                              if (!a.querySelector('[data-swaction="addToWishlist"]')) {
                                  var b = "swym-button swym-add-to-wishlist-view-product";
                                  "heart" !== f && (b = b + " custom-grid-icon-" + f);
                                  b = SwymUtils.createElement('<button class="' + b + '" data-swaction="addToWishlist" onclick="event.preventDefault(); event.stopPropagation();" aria-label="' + B.WishlistAddCTA + '"></button>');
                                  (a = e ? a.querySelector(e) : null) && a.insertAdjacentElement("afterend", b);
                              }
                          });
                          h.initializeActionButtonsOnProductGrid(c);
                      }
                  }
                  var k = h.retailerSettings.Watchlist.ProductGridButton;
                  k &&
                      ((a = h.getApp("Watchlist")), (c = h.getApp("ShoppingAssistant")), (b = k.Enabled), (a && a.enabled && b) || (c && c.enabled && b)) &&
                      ((e = k.attachButtonSelector),
                      (c = U.productTileSelector),
                      SwymUtils.forEachElement(c, function (a) {
                          var b = a.querySelector('[data-swaction="addToWatchlist"]'),
                              c = k.soldOutPatternSelector.selector,
                              c = c ? a.querySelector(c) : null,
                              d = k.soldOutPatternSelector.keyword,
                              f = !1;
                          c && c.innerText === d && (f = !0);
                          !b &&
                              f &&
                              ((b = k.ButtonType || "icon"),
                              (c =
                                  '<button class="swym-button swym-add-to-watchlist-view-product swym-grid-watchlist-btn" data-swaction="addToWatchlist" onclick="event.preventDefault(); event.stopPropagation();" aria-label="' +
                                  B.WatchlistAddCTA +
                                  '">'),
                              (d = k.ButtonText ? k.ButtonText : B.WatchlistAddCTA),
                              (b =
                                  "icon" === b
                                      ? SwymUtils.createElement(c + "</button>")
                                      : "icontext" === b
                                      ? SwymUtils.createElement(
                                            '<div class="swym-grid-watchlist-btn-wrapper">' + c + '<span class="swym-grid-watchlist-text" onclick="event.preventDefault(); event.stopPropagation();">' + d + "</span></button></div>"
                                        )
                                      : SwymUtils.createElement(
                                            '<span class="swym-button-bar swym-add-to-watchlist-view-product swym-grid-watchlist-textbtn" data-swaction="addToWatchlist" onclick="event.preventDefault(); event.stopPropagation();" aria-label="' +
                                                B.WatchlistAddCTA +
                                                '">' +
                                                d +
                                                "</span>"
                                        )),
                              (a = e ? a.querySelector(e) : null) && a.insertAdjacentElement("afterend", b));
                      }),
                      h.initializeActionButtonsOnProductGrid(c));
              }
          }, 500);
          f.prototype.injectHeaderLaunchpointOnHeaderLazily = SwymUtils.debounce(function (a) {
              try {
                  a = h.retailerSettings.Wishlist.headerConfig;
                  var b = "wishlistheader.debug" === SwymUtils.getParameterByName("swaction") ? !0 : !1;
                  if (a) {
                      var c = h.getApp("Wishlist"),
                          d = h.getApp("ShoppingAssistant");
                      if ((c && c.enabled) || (d && d.enabled)) {
                          var e = a.desktop,
                              f = a.mobile;
                          (!e.Enabled && !b) ||
                              SwymUtils.isElementAvailable("#swym-inject-header") ||
                              (0 < e.attachButtonSelector.length
                                  ? SwymUtils.isElementAvailable(e.attachButtonSelector)
                                      ? eb(e, !1)
                                      : SwymUtils.warn("Invalid desktop header element selector, adjacent element not found")
                                  : SwymUtils.warn("Desktop header enabled, but attachSelector is empty"));
                          (!f.Enabled && !b) ||
                              SwymUtils.isElementAvailable("#swym-inject-header-mobile") ||
                              (0 < f.attachButtonSelector.length
                                  ? SwymUtils.isElementAvailable(f.attachButtonSelector)
                                      ? eb(f, !0)
                                      : SwymUtils.warn("Invalid mobile header element selector, adjacent element not found")
                                  : SwymUtils.warn("Mobile header enabled, but attachSelector is empty"));
                      }
                  }
              } catch (k) {
                  SwymUtils.error("Error - Wishlist header Injection failed, Re-evaluate the config", k);
              }
          }, 500);
          f.prototype.createWishlistButton = function (a, b, c) {
              var d = SwymViewProducts[a],
                  e = SwymUtils.createElement(
                      "<button class='swym-button swym-add-to-wishlist-view-product " +
                          (c || "") +
                          " swym-" +
                          (w.ButtonType || "") +
                          " swym-" +
                          (w.ButtonIcon || "") +
                          "' data-swaction='addToWishlist' data-product-id='' aria-label='" +
                          B.WatchlistAddCTA +
                          "'></button>"
                  );
              return d
                  ? (e.setAttribute("data-product-id", d.empi),
                    ba(d),
                    h.reportPageview(d),
                    b.forEach(function (a) {
                        var b = e.cloneNode(!0);
                        a && document.querySelector(a).insertAdjacentElement("beforeend", b);
                        W("addToWishList", h.EventTypes.addToWishList, b, d);
                    }),
                    !0)
                  : !1;
          };
          var Zb = { addToCart: ["addToCart", "add_to_cart"], soldOut: ["soldOut", "sold_out"] };
          window.theme &&
              window.theme.strings &&
              (f.prototype.getThemeString = function (a) {
                  var b = "";
                  try {
                      var c = Zb[a];
                      if (c)
                          for (var d = window.theme.strings; 0 < c.length; c++) {
                              var e = d[c[0]];
                              if (e) {
                                  b = e;
                                  break;
                              }
                          }
                  } catch (f) {}
                  return b;
              });
          f.prototype.variantChanged = function (a, b) {
              ta(a, b);
          };
          f.prototype.mapShopifyProducts = function (a) {
              a.forEach(function (a) {
                  window.SwymViewProducts[a.handle] = window.SwymViewProducts[a.id] = Aa(a);
                  window.SwymWatchProducts[a.handle] = window.SwymWatchProducts[a.id] = za(a);
              });
          };
          f.prototype.initializeActionButtons = function (a, b) {
              var c = a ? document.querySelector(a) : null;
              if (c) {
                  if (w && w.Enabled) {
                      for (var d = c.querySelectorAll(b || "[data-swaction]:not([data-with-epi])"), e = 0, f = d.length; e < f; e++) ma(d[e]);
                      d = c.querySelectorAll(b || "[data-swaction][data-with-epi]");
                      e = 0;
                      for (f = d.length; e < f; e++) jb(d[e]);
                  }
                  if (z && z.Enabled) for (d = c.querySelectorAll(b || "[data-swaction]"), e = 0, f = d.length; e < f; e++) Ea(d[e]);
              }
          };
          f.prototype.initializeActionButtonsOnProductGrid = function (a) {
              w && w.Enabled && a && SwymUtils.forEachElement(a, Kb);
              z && z.Enabled && a && SwymUtils.forEachElement(a, Lb);
          };
          var nb = "backinstock";
          f.prototype.getProducts = function (a, b, c) {
              b = new Date(b).toJSON();
              SwymUtils.ajaxOpt({
                  url: this.platform.getInterfacePath().replace("interfaceStore", "getProductsForIds"),
                  method: "POST",
                  data: SwymUtils.getObjectAsEncoded({ shopid: this.getRetailerConfig("ShopId"), ids: a.join(","), since: b }),
                  callback: function (a) {
                      try {
                          var b = JSON.parse(a.responseText);
                          c(b.data);
                      } catch (f) {
                          c({});
                      }
                  },
              });
          };
          var Qb = ["cart", "swym-session-id", "swym-swymRegid", "swym-email"];
          window.initSwymShopify = function (a) {
              if (a || !sb) {
                  sb = !0;
                  a = h.getSwymRegistrationId();
                  h.getSwymHostUri();
                  var b = window.SwymPageData || { et: h.EventTypes.unknownView };
                  ba(b);
                  var c = b.ct;
                  c && 200 < c.length && (b.ct = c.substr(0, 200).trim());
                  h.api.trackPageview(b);
                  h.storage.set("cu_ct", window.swymCart.token);
                  h.evtLayer.addEventListener(h.JSEvents.regidRefreshed, function (a) {
                      aa();
                  });
                  Ab();
                  a
                      ? (gb
                            ? h.initializeUi(function () {
                                  fb(b);
                              })
                            : fb(b),
                        SwymUtils.isBot() || aa())
                      : (h.holdCallbacks(),
                        h.evtLayer.addEventListener(f.JSEvents.registered, function e() {
                            aa(!0);
                            ua(!0);
                            ra(b);
                            h.evtLayer.removeEventListener(f.JSEvents.registered, e);
                        }));
              }
          };
          window.history &&
              ((history.pushState = (function (a) {
                  return function () {
                      var b = a.apply(this, arguments);
                      window.dispatchEvent(new SwCustomEvent("swym:pushState"));
                      window.dispatchEvent(new SwCustomEvent("swym:locationchange"));
                      return b;
                  };
              })(history.pushState)),
              (history.replaceState = (function (a) {
                  return function () {
                      var b = a.apply(this, arguments);
                      window.dispatchEvent(new SwCustomEvent("swym:replaceState"));
                      window.dispatchEvent(new SwCustomEvent("swym:locationchange"));
                      return b;
                  };
              })(history.replaceState)),
              window.addEventListener("popstate", function () {
                  window.dispatchEvent(new SwCustomEvent("swym:locationchange"));
              }),
              (window.SwymCallbacks = window.SwymCallbacks || []),
              SwymCallbacks.push(function () {
                  window.addEventListener("swym:locationchange", function (a) {
                      a = h.getApp("Watchlist") ? SwymWatchProducts : SwymProductVariants;
                      var b = SwymUtils.getParameterByName("variant");
                      b && a[b] && V != b && h.platform.checkVariantChange();
                  });
              }));
          var Ra;
          window.triggerSwymVariantEvent = function (a) {
              try {
                  var b = SwymWatchProducts[a] || za(La)[a];
                  a != V && b && ((V = a), h.triggerSwymEvent(h.JSEvents.variantChanged, { currentVariantId: V, product: La, variant: b }));
              } catch (c) {}
          };
          v.push({
              id: "shopify",
              events: { variantChanged: "sw:variantchanged" },
              init: function () {
                  h = this;
                  this.platform = {
                      type: "Shopify",
                      productDetailsCfg: {
                          hashFn: function (a) {
                              return a["raw-du"] || a.du;
                          },
                          preloadHashFn: function (a, b) {
                              return b;
                          },
                          internalFn: function (a, b, c) {
                              SwymUtils.ajaxGET(h.platform.getProductUrl(a.params["raw-du"] || a.params.du) + ".js", function (a) {
                                  try {
                                      var e = JSON.parse(a.responseText);
                                      b(e);
                                  } catch (f) {
                                      SwymUtils.error("Error getProductDetails .js", f), c(f, a);
                                  }
                              });
                          },
                      },
                      isInDeviceCart: function (a) {
                          for (var b = window.swymCart, c = 0; c < b.items.length; c++) if (b.items[c].id == a) return !0;
                          return !1;
                      },
                      refreshCustomerStatus: function () {
                          h.getSwymRegistrationId() && ua(!0);
                      },
                      getProductUrl: function (a) {
                          return a.replace(/http:|https:/, location.protocol).split("?")[0];
                      },
                      getBaseEpiMultiVariantProduct: function (a, b) {
                          b(SwymViewProducts[a].epi);
                      },
                      checkVariantChange: function () {
                          Na();
                      },
                      isAdminMode: function () {
                          try {
                              if (document.getElementById("admin_bar_iframe")) {
                                  var a = function () {
                                          SwymUtils.addClass(b, "swym-shopify-admin");
                                          SwymUtils.addClass(document.body, "swym-shopify-admin");
                                      },
                                      b = document.getElementById("swym-plugin");
                                  b
                                      ? a()
                                      : h.evtLayer.addEventListener(h.JSEvents.renderRelayUI, function () {
                                            b = document.getElementById("swym-plugin");
                                            a();
                                        });
                                  return !0;
                              }
                          } catch (c) {}
                          return !1;
                      },
                      isInventorySetUpCorrectly: function (a) {
                          return a.inventory_management && ("deny" == a.inventory_policy || (h.retailerSettings.Watchlist.ShowIfPolicyAllow && "continue" == a.inventory_policy) || SwymUtils.isUndefined(a.inventory_policy));
                      },
                      isEpiOOS: function (a) {
                          var b = !1;
                          SwymPageData.et == h.EventTypes.productView ? (b = h.platform.isVariantInProductOutOfStock(a, window.SwymProductInfo.product)) : (a = window.SwymWatchProducts[a]) && (b = h.platform.isVariantOOS(a));
                          return b;
                      },
                      transformCartItem: Nb,
                      isVariantOOS: function (a) {
                          var b = !1;
                          SwymUtils.isUndefined(a.available)
                              ? SwymUtils.isUndefined(a.inventory_quantity) || SwymUtils.isUndefined(a.inventory_policy)
                                  ? SwymUtils.warn("Swym snippet needs migration since available variable as well as inventory_quantity inventory_policy variables not set.")
                                  : "deny" == a.inventory_policy
                                  ? (b = 1 > a.inventory_quantity)
                                  : h.retailerSettings.Watchlist.ShowIfPolicyAllow && "continue" == a.inventory_policy && (b = 1 > a.inventory_quantity)
                              : SwymUtils.isUndefined(a.inventory_policy) || "deny" == a.inventory_policy
                              ? (b = !a.available)
                              : h.retailerSettings.Watchlist.ShowIfPolicyAllow && "continue" == a.inventory_policy && (b = 1 > a.inventory_quantity);
                          return b;
                      },
                      isVariantInProductOutOfStock: function (a, b) {
                          var c = za(b)[a];
                          return c ? h.platform.isInventorySetUpCorrectly(c) && h.platform.isVariantOOS(c) : !1;
                      },
                      getInterfacePath: Sb,
                      getDuFromVariantUri: function (a) {
                          return a.split("?")[0];
                      },
                      addToCart: function (a) {
                          var b = a.epi,
                              c = a.callback,
                              d = a.errorCallback;
                          a.du = a.product.du;
                          h.api.getProductDetails(a, function (a) {
                              try {
                                  for (var f = 0; f < a.variants.length; f++) {
                                      var k = a.variants[f];
                                      if (k.id == b) {
                                          h.platform.isVariantOOS(k)
                                              ? d("Variant is in stock")
                                              : SwymUtils.ajaxOpt({
                                                    url: location.protocol + "//" + location.host + "/cart/add.js",
                                                    data: "id=" + b + "&quantity=1",
                                                    method: "POST",
                                                    callback: function (a) {
                                                        c && c(a.responseText);
                                                    },
                                                });
                                          break;
                                      }
                                  }
                              } catch (m) {
                                  d && d(m), SwymUtils.log("Error loading product for addToCart", m, { epi: b });
                              }
                          });
                      },
                      redirectToCartPage: function () {
                          window.location = location.protocol + "//" + location.host + "/cart";
                      },
                      isProductInCart: function (a) {
                          var b = window.swymCart;
                          if (b && b.items) for (var c = b.items.length - 1; 0 <= c; c--) if (b.items[c].id == a.epi && a.et == h.EventTypes.addToCart) return !0;
                          return !1;
                      },
                      getVariantUrlFromDu: function (a, b) {
                          var c = a;
                          return (c = -1 == c.indexOf("?") ? c + ("?variant=" + b) : c + ("&variant=" + b));
                      },
                      getVariantString: function (a) {
                          var b = "";
                          a.vval1 && "Default Title" != a.vval1 && (b += a.vval1);
                          a.vval2 && "Default Title" != a.vval2 && (b += " / " + a.vval2);
                          a.vval3 && "Default Title" != a.vval3 && (b += " / " + a.vval3);
                          return b;
                      },
                      isStorefrontLoggedIn: function () {
                          return !!window.swymCustomerId;
                      },
                      redirectToLoginPage: function (a) {
                          window.location = "/account/login?returnUrl=" + encodeURIComponent(a);
                      },
                      addAllToCart: function (a, b, c) {
                          var d = { items: [] };
                          a.forEach(function (a, b) {
                              d.items.push({ quantity: a.qty || 1, id: a.epi });
                          });
                          SwymUtils.ajaxOpt({
                              url: "/cart/add.js",
                              method: "POST",
                              data: JSON.stringify(d),
                              headers: { "Content-Type": "application/json" },
                              callback: function (a) {
                                  try {
                                      var d = JSON.parse(a.responseText);
                                      b(d, a);
                                  } catch (f) {
                                      c(null, a, f);
                                  }
                              },
                          });
                      },
                  };
                  h.evtLayer.addEventListener(h.JSEvents.readRetailerConfig, function (a) {
                      h.platform.refreshCustomerStatus();
                  });
                  h.evtLayer.addEventListener(h.JSEvents.productImageError, function (a) {
                      var b = a.detail.e;
                      h.api.getProductDetails(a.detail.d, function (a) {
                          a = a.images[0];
                          b.querySelector(".swym-image img").src = a;
                      });
                  });
              },
          });
          f.prototype.createWorker = function (a, b, c) {
              if (0 < this.appsCache.length) {
                  if (window.Worker) {
                      this.webworkerSupported = !0;
                      this.workers = this.workers || {};
                      this.handlers = this.handlers || {};
                      var d = a.subject;
                      if (!this.workers[d]) {
                          var e = this;
                          this.workers[d] = new Worker("/apps/swym" + this.appsCache[0].app + "/scripts/swym-ww.js");
                          this.workers[d].onmessage = function (a) {
                              a = JSON.parse(a.data);
                              var b = a.subject,
                                  c = a.result,
                                  d = a.id;
                              c.error ? e.handlers[d].error(c, b) : e.handlers[d].receive(c, b);
                              a.keepalive || delete e.handlers[d];
                          };
                      }
                      var f = a.subject + Date.now();
                      this.handlers[f] = { receive: b, error: c };
                      a.source = "swym";
                      a.id = f;
                      this.workers[d].postMessage(a);
                  } else (this.webworkerSupported = !1), console.log("Sorry, worker not supported");
                  return this.webworkerSupported;
              }
              return !1;
          };
          v.push({
              id: "shopify-worker-helper",
              init: function () {
                  var a = this;
                  a.evtLayer.addEventListener(a.JSEvents.configLoaded, function () {
                      if (!a.retailerSettings.General.DisablePrefetchWorkers) {
                          var b = function () {
                                  clearTimeout(f);
                                  return setTimeout(function () {
                                      f = b();
                                  }, 3e5);
                              },
                              c = function (b) {
                                  var c = a.platform.productDetails.mcache || {};
                                  b = b
                                      .map(function (b) {
                                          return a.platform.getProductUrl(b);
                                      })
                                      .filter(function (a) {
                                          return !(a in c);
                                      })
                                      .filter(d);
                                  SwymUtils.arrayPartition(b, 3).forEach(function (b) {
                                      a.createWorker(
                                          { subject: "prefetch-jsons", payload: b },
                                          function (b) {
                                              if (b.r) {
                                                  var c = {};
                                                  c[b.l] = b.r;
                                                  a.platform.productDetails.cacheLoadScb({}, c);
                                              }
                                          },
                                          function (a) {
                                              console.log("error", arguments);
                                          }
                                      );
                                  });
                              },
                              d = function (a) {
                                  var b = !(a in e);
                                  e[a] = !0;
                                  return b;
                              };
                          a.evtLayer.addEventListener(a.JSEvents.fetchNewsfeed, function (a) {
                              b();
                          });
                          a.evtLayer.addEventListener(a.JSEvents.fetchProducts, function (a) {
                              a = a.detail.d.map(function (a) {
                                  return a.du;
                              });
                              100 > a.length && (c(a), b());
                          });
                          a.evtLayer.addEventListener(a.JSEvents.renderProductDetailSlide, function (b) {
                              b = b.detail.d.idx;
                              for (var d = a.productCache.getObject(), e = d.length, f = [], g = 1; 2 >= g; g++) {
                                  var h = d[b + g < e ? b + g : b + g - e];
                                  h && f.push(h);
                                  (h = d[-1 < b - g ? b - g : b - g + e]) && f.push(h);
                              }
                              b = f.map(function (a) {
                                  return a.du;
                              });
                              c(b);
                          });
                          var e = {};
                          a.evtLayer.addEventListener(a.JSEvents.fetchProducts, function (b) {
                              b = b.detail.d
                                  .map(function (a) {
                                      return a.iu;
                                  })
                                  .filter(d);
                              100 > b.length &&
                                  SwymUtils.arrayPartition(b, 3).forEach(function (b) {
                                      a.createWorker(
                                          { subject: "prefetch-imgs", payload: b },
                                          function () {},
                                          function () {
                                              console.log("error", arguments);
                                          }
                                      );
                                  });
                          });
                          var f;
                      }
                  });
              },
          });
          var O = new f();
          window._swat = O;
          window._swat._swrt = window._swrt;
          window.SwymTracker = f;
      })();
