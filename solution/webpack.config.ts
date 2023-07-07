import * as path from 'path';
import * as webpack from 'webpack';
import * as fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatoscopePlugin from '@statoscope/webpack-plugin';

// @todo загрузить переводы из файла\
const i18n = fs.readFileSync('./i18n.json', { encoding: 'utf-8' });

const config: webpack.Configuration = {
    mode: 'production',
    entry: ['./src/pages/root.tsx', './src/pages/root2.tsx'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new StatoscopePlugin({
            saveStatsTo: 'stats.json',
            saveOnlyStats: false,
            open: false,
        }),
    ],

    resolve: {
        // @todo настроить resolve
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            // @todo настроить загрузчик
            {
                test: /\.ts(x?)$/,
                use: [
                    'ts-loader',
                    {
                        loader: 'i18n-loader',
                        options: JSON.parse(i18n),
                    },
                ],
            },
        ],
    },
    resolveLoader: {
        alias: {
            'i18n-loader': path.resolve(__dirname, 'loaders/i18n-loader.cjs'),
        },
    },
};

export default config;
