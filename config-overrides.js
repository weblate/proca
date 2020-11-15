const webpack = require('webpack');
const fs=require('fs');
const { paths } = require('react-app-rewired');
const { useBabelRc,override, addBundleVisualizer} = require('customize-cra')
const { addReactRefresh } = require('customize-cra-react-refresh')
const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path');
require = require('esm')(module /*, options*/);

const {fetch, file, read} = require ('./src/lib/config');

//process.env.NODE_ENV="development";

/* for brotli (future version) 
  const zlib = require('zlib');
  config.plugins.push(new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: 11,
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    }));

*/

const appPackageJson = require(paths.appPackageJson);
const minorVersion = appPackageJson.version.split(".").slice(0,2).join("-");

//paths.appIndexJs = paths.appIndexJs.replace('index.js','Widget.js'); // NOT WORKING, modified index.js
// potential workaround : https://gist.github.com/benedictjohannes/33f93ccd2a66b9c150460c525937a8d3
//
const conditionalImport = (id,alias,journey) =>{
//  config.resolve.alias['Conditional_Share$']= path.resolve(__dirname, 'src/components/')+'/Disabled.js';
  const j = journey.flat();
  let steps = {
    'petition': 'Petition',
    'share': 'Share',
    'button': 'FAB',
    'twitter': 'Twitter',
    'dialog': 'Dialog',
    'Ep': 'Ep',
    'DonateAmount': 'DonateAmount',
    'DonateStripe': 'DonateStripe',
    'clickify': 'Clickify',
    'html': 'Html',
    'register': 'Register',
    'register.CH': 'bespoke/Register-CH',
    'download': 'bespoke/Download',
  };


  let script = "// automatically generated by yarn -config-overrides.js, do not modify\n";
  j.forEach( k => {
    let Component = steps[k] ? steps[k] : k;
    script += "\nimport "+k.replace('/','_')+" from '"+path.resolve(__dirname, 'src/components/')+'/'+Component+".js'\n";
  });
  script += "let steps={};\n";
  j.forEach( (k) => {
    let name=k.replace('/','_');
    script += "steps['"+name+"']=" + name +";\n";
  });
//  -import Button from "./FAB";
//-import Dialog from "./Dialog";

  script += "export {steps as allSteps}\n";
  script += "export {steps}\n";
  const wpathLoad='./src/tmp.config/'+id+'.load.js';
  alias['ComponentLoader$']= path.resolve(__dirname, 'src/tmp.config/')+'/'+id+'.load.js';
  fs.writeFileSync(wpathLoad,script);
}

  const string2array  = (s) => {
    const a = s.split(',');
    a.forEach ((d,i) => {
      const sub= d.split('+');
      if (sub.length === 1) return;
      a[i]=sub;
    });
    return a;
  }

  const stringified = (raw) => {
    const d ={
    'process.widget': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
    };
    // syntax step1,step2, step3+substep3.1+substep3.2, step4  ('+' to have substeps, like in a dialog)
    d['process.widget'].journey = JSON.stringify(raw.journey);
    return d;
  };

module.exports = function override (config, env) {
// todo: add babel +                  "i18next-extract",
//  useBabelRc();
  let widget = {};
  const id=parseInt(process.env.actionpage || process.argv[2],10);

  process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer();

  if (!id) {
    console.error("we need an env$ actionpage={id} yarn or yarn start/build {id}");
    process.exit (1);
  }
  widget = read(id);
  if (!widget.actionpage) widget.actionpage=widget.actionPage;
  fetch(id).then(d =>{
    console.log("d",d);
    console.log ("pulled the config");
//  process.exit(1);
  }).catch(d => {
    console.log("error fetching action", widget.actionpage);
  });

  config.resolve.alias['Config$']= file(widget.actionpage);
  // doesn't work addWebpackPlugin(new webpack.DefinePlugin(stringified(w.parsed)));
  config.plugins.unshift(new webpack.DefinePlugin(stringified(widget)));
//  console.log(stringified(widget));  process.exit(1);
  config.plugins.push(new CompressionPlugin({exclude:/\*.map$/,test:"index.js",include:"index.js"}));
  config.plugins.push(
        {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          if (config.mode !== 'production') return;
          fs.symlinkSync(path.resolve(__dirname,'d/'+widget.filename+'/index.js'), './build/index.js');
//          fs.unlinkSync(path.resolve(__dirname,'d/'+widget.filename+'/index.js'));
//          fs.unlinkSync(path.resolve(__dirname,'d/'+widget.filename+'/index.js.map'));
//          fs.unlinkSync(path.resolve(__dirname,'d/'+widget.filename+'/index.js.map.gz'));
//          fs.unlinkSync(path.resolve(__dirname,'d/'+widget.filename+'/index.js.LICENSE.txt.gz'));
        });
      }
    }
  );
//  config = addReactRefresh({ overlay: {sockIntegration: 'whm' }}) (config,env);
  config.optimization.runtimeChunk = false;
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false
    }
  };
  conditionalImport(widget.actionpage, config.resolve.alias,widget.journey);

//  config.resolve.alias['locales']= path.resolve(__dirname, 'src/locales/');
  config.resolve.alias['locales']= path.resolve(__dirname, 'src/locales/'+widget.lang.toLowerCase());

  if (widget.layout.HtmlTemplate) {
    config.plugins[1].options.template = path.resolve(__dirname,"public/"+widget.layout.HtmlTemplate)
  }
  if (process.env.NPM ==='1') {
    config.entry= './src/module.js';
    config.output= {
      path: path.resolve('lib'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    };
    config.plugins[1].options.minify.collapseWhitespace = false;
    config.plugins[1].options.minify.minifyCSS = false;
    config.plugins[1].options.minify.minifyJS = false;
    console.log(config.plugins); process.exit(1);
  }
  if (config.mode === 'production' && process.env.NPM !=='1') {
    //config.output.filename= 'static/js/[name].'+minorVersion+'.js'
    //config.output.filename= 'd/'+widget.filename+'/index.js';
    config.output.filename= 'index.js';
    config.output.path = path.resolve(__dirname,'d/'+widget.filename);
    config.output.publicPath = '/d/'+widget.filename +'/'; //'./';
    // HtmlWebpackPlugin
    //config.plugins[1].options.template = path.resolve(__dirname,"public/"+)
    config.plugins[1].options.minify.collapseWhitespace = false;
    config.plugins[1].options.minify.minifyCSS = false;
    config.plugins[1].options.minify.minifyJS = false;
  }
/* to prevent loading react
  config.externals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
 *
 *
 *
 */
  /*
     filename: isEnvProduction
        : isEnvDevelopment && 'static/js/bundle.js',
*/
  config.output.libraryTarget= 'umd';
  config.output.library = ["proca"];
//  console.log(config);
  return config
}


