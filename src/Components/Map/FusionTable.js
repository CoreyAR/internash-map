import React, { PropTypes as T } from 'react'

import { camelize } from './lib/String'
const evtNames = ['click', 'mouseover', 'recenter', 'mouseenter']

const wrappedPromise = function () {
  var wrappedPromise = {}
  var promise = new Promise(function (resolve, reject) {
    wrappedPromise.resolve = resolve
    wrappedPromise.reject = reject
  })
  wrappedPromise.then = promise.then.bind(promise)
  wrappedPromise.catch = promise.catch.bind(promise)
  wrappedPromise.promise = promise

  return wrappedPromise
}

export class FusionTable extends React.Component {

  componentDidMount () {
    this.fusionTablePromise = wrappedPromise()
    this.renderFusionTable()
  }

  componentWillUnmount () {
    if (this.fusionTable) {
      this.fusionTable.setMap(null)
    }
  }

  getPoints () {
    return []
  }

  renderFusionTable () {
    let {
      map, google, imageBounds, image
    } = this.props
    if (!google) {
      return null
    }

  // let pos = position || mapCenter;
    // if (!(pos instanceof google.maps.LatLng)) {
    //   position = new google.maps.LatLng(pos.lat, pos.lng);
    // }

    const pref = {
      map: map,
      imageBounds: imageBounds,
      image: image
    }
    this.fusionTable = new google.maps.FusionTablesLayer({
          query: {
            select: '\'geometry\'',
            from: '1fWfM5sv8K0Dvkq--Yzwwj2zClVRefqh6gnGiyg'
          }
        });
    // new google.maps.FusionTable(pref.image, pref.imageBounds)
    this.fusionTable.setMap(pref.map)

    evtNames.forEach(e => {
      this.fusionTable.addListener(e, this.handleEvent(e))
    })

    return this.fusionTable
  }

  getFusionTable () {
    return this.fusionTablePromise
  }

  handleEvent (evt) {
    return (e) => {
      const evtName = `on${camelize(evt)}`
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.fusionTable, e)
      }
    }
  }

  render () {
    return null
  }
}

FusionTable.propTypes = {
  imageBounds: T.object,
  image: T.string,
  map: T.object,
  polygon: T.object,
  visible: T.bool,
    // callbacks
  onClose: T.func,
  onOpen: T.func
}

evtNames.forEach(e => {
  FusionTable.propTypes[e] = T.func
})

FusionTable.defaultProps = {
  name: 'FusionTable',
  visible: false
}

export default FusionTable
