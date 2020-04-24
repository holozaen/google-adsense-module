import Vue from 'vue'

// Custom AdSense Ad Component
const adsbygoogle = {
  render (h) {
    return h(
      'ins',
      {
        'class': ['adsbygoogle'],
        style: this.adStyle,
        attrs: {
          'data-ad-client': this.adClient,
          'data-ad-slot': this.adSlot || null,
          'data-ad-format': this.adFormat,
          'data-full-width-responsive': this.widthResponsive
        },
        domProps: {
          innerHTML: this.show ? '' : ' '
        },
        key: Math.random()
      }
    )
  },
  props: {
    adClient: {
      type: String,
      default: '<%= options.id %>'
    },
    adSlot: {
      type: String
    },
    adFormat: {
      type: String,
      default: 'auto'
    },
    adStyle: {
      type: Object,
      default () {
        return {
          display: 'block'
        }
      }
    },
    widthResponsive: {
      type: Boolean,
      default: true,
    }
    includeQuery: {
      type: Boolean,
      default: <%= options.includeQuery %>
    }
  },
  data () {
    return {
      show: true
    }
  },
  mounted () {
    this.showAd()
  },
  watch: {
    '$route' (to, from) {
      if (to.fullPath === from.fullPath) {
        return;
      }
      const keys = Object.keys
      const toQuery = to.query
      const fromQuery = from.query
      let changed = false
      if (to.path !== from.path) {
        changed = true
      } else if (this.includeQuery) {
        // If we include query params, check to see if they are loosely unequal
        changed = (keys(toQuery).length !== keys(fromQuery).length) || !keys(toQuery).every(k => toQuery[k] === fromQuery[k])
      }
      if (changed) {
        // If the route has changed, update the ad
        this.updateAd()
      }
    }
  },
  methods: {
    adRegion () {
      return 'page-' + Math.random()
    },
    updateAd () {
      if (this.isServer) {
        return
      }
      // Reset the INS element
      this.show = false
      // Show new ad on nextTick
      this.$nextTick(this.showAd)
    },
    showAd () {
      this.show = true
      this.$nextTick(() => {
        try {
          // Once ad container (<ins>) DOM has (re-)rendered, requesst a new advert
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
          console.error(error)
        }
      })
    }
  }
}

// Register our ad component under the desired tag name
Vue.component('<%= options.tag %>', adsbygoogle)
