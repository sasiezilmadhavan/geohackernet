//Loads a single js file
var loadScript = function (path) {
    return new Promise(function (fulfill, reject) {
                       var script = document.createElement('script');
                       script.onload = script.onreadystatechange = function () {
                       if (!this.readyState || this.readyState == 'complete') fulfill(this);
                       };
                       script.src = path;
                       document.getElementsByTagName('head')[0].appendChild(script);
                       });
};

//Loads a set of js files in order
var loadScripts = function (scripts) {
    return scripts.reduce(function (queue, path) {
                          return queue.then(function () {
                                            return loadScript(path);
                                            });
                          }, Promise.resolve());
};

//Load altus and altus utils and create an instance of Altus
loadScripts(["altus.js", "altusutil.js"]).then(function (){
    createAltusUnified();
});