/**
 * Change the opacity in a RBGA color string.
 *
 * @param rgba   The rgba string.
 * @param alpha The alpha value, defaults to fully opaque.
 */
const rgb2rgba = (rgba: string, alpha: number = 1) => {
    const matches = rgba.match(/rgba\([0-9]+, [0-9]+, [0-9]+, [0-9.]+\)/)

    if (!matches) {
        throw new Error(`Cannot convert ${rgba} to a rgba value since it is not a RGBA string.`)
    }

    const split = rgba.split(',')
    split[3] = `${alpha})`
    return split.join(',')
}

export default rgb2rgba
