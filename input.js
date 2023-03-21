/**
 * @typedef { 'ascii' | 'base64' | 'hex' | 'ucs2' | 'ucs-2' | 'utf16le' | 'utf-16le' | 'utf8' | 'utf-8' | 'binary' | 'latin1' } Encoding
 */

/**
 * @param { string } [text] 
 * @param { Encoding } encoding
 * @returns { Promise<string> }
 */

const input = async (text, encoding = 'utf-8') => {

    let _enc = process.stdin._readableState.encoding || process.stdin._readableState.defaultEncoding
    process.stdin.setEncoding(encoding)

    if (text) process.stdout.write(text)

    return new Promise((resolve) => {
        process.stdin.resume()

        process.stdin.on('data', function (data) {
            process.stdin.pause()
            process.stdin.setEncoding(_enc)
            resolve(encoding = 'utf-8' ? data.trim() : data)
        })

    })
}

/**
 * @param { string } [text]
 * @param { (data: string) => void } callback
 * @param { Encoding } encoding
 */
const inputSync = (text, callback, encoding = 'utf-8') => {

    let _enc = process.stdin._readableState.encoding || process.stdin._readableState.defaultEncoding
    process.stdin.setEncoding(encoding)

    if (text) process.stdout.write(text)


    process.stdin.resume()

    process.stdin.on('data', function (data) {
        process.stdin.pause()
        process.stdin.setEncoding(_enc)
        callback(encoding = 'utf-8' ? data.trim() : data)
    })
}

module.exports = {
    input, inputSync
}