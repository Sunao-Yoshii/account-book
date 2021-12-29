// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js
module.exports = {
  resources: [
    { from: 'src/client/resources/', to: 'dist/resources/' },
    { from: 'node_modules/bootstrap/dist', to: 'src/bootstrap' },
    { from: 'node_modules/bootstrap/dist', to: 'dist/bootstrap' },
    { from: 'node_modules/bootstrap-icons/icons', to: 'src/bootstrap-icons/icons' },
    { from: 'node_modules/bootstrap-icons/icons', to: 'dist/bootstrap-icons/icons' },
    { from: 'node_modules/bootstrap-icons/font', to: 'src/bootstrap-icons/font' },
    { from: 'node_modules/bootstrap-icons/font', to: 'dist/bootstrap-icons/font' }
  ],

  sourceDir: './src/client',

  devServer: {
    proxy: { '/': 'http://localhost:3002' }
  }
};
