// Webpack uses this to work with directories
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports = {

    // Path to your entry point. From this file Webpack will begin its work
    entry: './assets/build/js/index.js',

    devtool: 'source-map',

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
        path: path.resolve(__dirname, 'assets/dist'),
        publicPath: '',
        filename: 'bundle.js'
    },

    module: {
        rules: [{
                // Apply rule for .js files
                test: /\.js$/,

                // Paths should be ignored when transforming modules
                exclude: /(node_modules)/,

                // Set loaders to transform files.
                use: {
                    // Transform our modern JavaScript code to browser-compatible JavaScript code before bundling it
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                // Apply rule for .sass, .scss or .css files
                test: /\.(sa|sc|c)ss$/,

                // Set loaders to transform files.
                use: [{
                        // After all CSS loaders, we use a plugin to do its work.
                        // It gets all transformed CSS and extracts it into separate
                        // single bundled file
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        // This loader resolves url() and @imports inside CSS
                        loader: "css-loader",
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        // Then we apply postCSS fixes like autoprefixer and minifying
                        loader: "postcss-loader",
                    },
                    {
                        // First we transform SASS to standard CSS
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                        }
                    }
                ]
            },
            {
                // Now we apply rule for images
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [{
                    // Using file-loader for these files
                    loader: "file-loader",

                    // In options we can set different things like format
                    // and directory to save
                    options: {
                        outputPath: 'images',
                        name: '[path][name].[ext]',
                    }
                }]
            },
            {
                // Apply rule for fonts files
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                use: [{
                    // Using file-loader too
                    loader: "file-loader",
                    options: {
                        outputPath: 'fonts',
                        name: '[name].[ext]',
                    }
                }]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.css"
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),

        new CopyWebpackPlugin({
            patterns: [{
                from: 'assets/build/images',
                to: 'images',
                noErrorOnMissing: true,
            }]
        }),

        new CopyWebpackPlugin({
            patterns: [{
                from: 'assets/build/acf-json',
                to: 'acf-json',
                noErrorOnMissing: true,
            }]
        }),

        new CopyWebpackPlugin({
            patterns: [{
                from: 'assets/build/lang',
                to: 'lang',
                noErrorOnMissing: true,
            }]
        }),
    ],

    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on the final bundle. For now, we don't need production's JavaScript 
    // minifying and other things, so let's set mode to development
    mode: 'development'
};