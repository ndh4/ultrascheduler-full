module.exports = {
    type: 'react-app',
    webpack: {
        aliases: {
            'cldr$': 'cldrjs',
            'cldr': 'cldrjs/dist/cldr',
        },
    }
}