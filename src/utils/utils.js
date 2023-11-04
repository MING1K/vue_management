const utils = {
  // 用于生成uuid
  S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  },
  /**
     * 获取一个UUID值
     */
  getUuid() {
    return (
      this.S4() +
            this.S4() +
            this.S4() +
            this.S4() +
            this.S4() +
            this.S4() +
            this.S4() +
            this.S4()
    )
  },

  /**
     * 打平数组
     * @param {Array} data
     * @param {*} attName
     * @returns {Array}
     */
  simpleArray: function(data, attName, objKeys) {
    if (!Array.isArray(data)) {
      return []
    }
    attName = attName || 'children'
    return data.reduce((accum, item) => {
      if (objKeys) {
        var copy = {}
        objKeys.forEach(element => {
          copy[element] = item[element]
        })
        accum.push(copy)
      } else {
        accum.push(item)
      }
      if (Array.isArray(item[attName])) {
        const tempArray = this.simpleArray(item[attName], attName, objKeys)
        accum = Array.isArray(tempArray) ? accum.concat(tempArray) : accum
      }
      return accum
    }, [])
  },

  /**
     *
     * @param {Array} nodes
     * @param {string} attName
     * @param {Array} objKeys
     * @returns
     */
  cloneTree(nodes, attName, objKeys) {
    if (!nodes) {
      return []
    }
    const copys = []
    for (let node of nodes) {
      var copy = {}
      if (objKeys) {
        objKeys.forEach(element => {
          copy[element] = node[element]
        })
      } else {
        copy = { ...node }
      }
      if (copy[attName]) {
        copy[attName] = this.cloneTree(copy[attName], attName, objKeys)
      } //
      else {
        copy[attName] = []
      }
      copys.push(copy)
    }
    return copys
  },

  /**
     *
     * @param {Array} nodes 树data
     * @param {string} attName children名称
     * @param {Array} mapKeys 映射键名
     * @returns
     */
  cloneTreeByMapKey(nodes, attName, mapKeys) {
    if (!nodes) {
      return []
    }
    const copys = []
    for (let node of nodes) {
      var copy = {}
      if (mapKeys) {
        mapKeys.forEach(element => {
          copy[element[0]] = node[element[1]]
          // copy[element] = node[element];
        })
      } else {
        copy = { ...node }
      }
      if (copy[attName]) {
        copy[attName] = this.cloneTreeByMapKey(copy[attName], attName, mapKeys)
      } //
      else {
        copy[attName] = []
      }
      copys.push(copy)
    }
    return copys
  },

  clone(obj) {
    return obj && JSON.parse(JSON.stringify(obj))
  },

  demandSet(result, param) {
    var rKeys = Object.keys(result)
    var pKeys = Object.keys(param)
    pKeys.forEach(pkey => {
      if (rKeys.includes(pkey)) {
        result[pkey] = param[pkey]
      }
    })
  },

  /**
     *
     * @param {Array} array
     * @param {Array} groupKeys
     * @returns
     */
  groupArray(array, groupKeys) {
    const groups = {}
    for (const item of array) {
      // var key = groupKeys.reduce((p, c) => p + ',' + item[c], '');
      var key = groupKeys.map(m => item[m]).join(',')
      groups[key] ??= []
      groups[key].push(item)
    }
    return groups
  },

  /** 移除数组中某一项
     *
     * @param {Array} array 数组
     * @param {*} item
     */
  removeItem(array, item) {
    var index = array.indexOf(item)
    if (index > -1) {
      array.splice(index, 1)
    }
  },

  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1)
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum)
      default:
        return 0
    }
  },

  evenArray(array) {
    let ds = []
    for (let index = 0; index < array.length; index++) {
      let d =
                index % 2 == 0
                  ? array[index / 2]
                  : array[array.length - (index + 1) / 2]
      ds.push(d)
    }
    return ds
  },

  array2Tree(array, id, pid) {
    if (!Array.isArray(array)) {
      return []
    }
    let roots = []
    let map = {}
    array.forEach(f => {
      map[f[id]] = f
    })
    array.forEach(f => {
      const parent = map[f[pid]]
      if (parent) {
        (parent.children || (parent.children = [])).push(f)
      } else {
        roots.push(f)
      }
    })
    return roots
  },

  array22Tree(array, id, pid) {
    if (!Array.isArray(array)) {
      return []
    }
    let roots = []
    let map = {}
    array.forEach(f => {
      map[f[id]] = f
    })
    array.forEach(f => {
      const parent = map[f[pid]]
      if (parent) {
        // f['level'] = -1;
        (parent.children || (parent.children = [])).push(f)
      } else {
        f['level'] = -1
        roots.push(f)
      }
    })
    // var re = (item, level) => {
    //   level++
    //   item?.children.forEach(i => {
    //     i.level = level
    //     if (i?.children) {
    //       re(i, level)
    //     }
    //   })
    // }
    // roots.forEach(item => {
    //   let level = item.level
    //   if (item?.children) {
    //     re(item, level);
    //   }
    // })
    return roots
  },

  getDiff(editParams, sourceParams, keys) {
    let diff = {}
    let eps = editParams || {}
    let sps = sourceParams || {}
    var eks = Object.keys(eps)
    var sks = Object.keys(sps)
    let ks = []
    if (!keys) {
      eks.forEach(f => {
        if (!ks.includes(f)) {
          ks.push(f)
        }
      })
      sks.forEach(f => {
        if (!ks.includes(f)) {
          ks.push(f)
        }
      })
    } else {
      ks = keys
    }
    ks.forEach(f => {
      if (Array.isArray(eps[f]) && Array.isArray(sps[f])) {
        if (
          JSON.stringify(this.clone(eps[f]).sort()) !=
                    JSON.stringify(this.clone(sps[f]).sort())
        ) {
          diff[f] = eps[f]
        }
      } else {
        if (eps[f] != sps[f]) diff[f] = eps[f]
      }
    })
    return diff
  }
}
export default utils
