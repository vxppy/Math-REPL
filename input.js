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

        let listen = function (data) {
            process.stdin.pause()
            process.stdin.setEncoding(_enc)
            process.stdin.removeListener('data', listen)
            resolve(encoding = 'utf-8' ? data.trim() : data)
        }
        process.stdin.on('data', listen)
    })
}

module.exports = {
    input
}