const path    = require('path');
const webpack = require('webpack');

const { getBuildVersion, getProjectName } = require('./bin/utils');

const isProd = process.env.NODE_ENV === 'production';


module.exports = (function() {
    const options = {
        devtool: !isProd ? 'eval' : 'source-map',
        stats: {
            children: false
        },
        devServer: {
            contentBase: './public',
            port: '3000'
        },
        mode: 'none',
        entry: {
            app: './src/index.ts',
        },
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: `[name].js`
        },
        resolve: {
            alias: {
                vue: path.resolve(__dirname, 'node_modules/vue/dist/vue.js')
            },
            extensions: ['.ts', '.js', '.styl', '.css'],
            modules: ['node_modules']
        },
        optimization: {
            minimize: isProd
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                '__BUILD_VERSION__': JSON.stringify(getBuildVersion()),
                '__PROJECT_NAME__': JSON.stringify(getProjectName())
            }),
            new webpack.NoEmitOnErrorsPlugin()
        ],
        module: {
            rules: [{
                test: /\.ts$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        useCache: true,
                        cacheDirectory: '.awcache'
                    }
                }],
                exclude: /(node_modules)/
            }]
        }
    };

    if (isProd) {
        options.plugins.push(
            new webpack.optimize.ModuleConcatenationPlugin()
        );
    } else {
        options.plugins.push(new webpack.NamedModulesPlugin());
    }

    return options;
}());
