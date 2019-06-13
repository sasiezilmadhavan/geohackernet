/*C1*/
var AltusUnified = new Altus(document.getElementById("AltusDiv"));

function createImageMarkersExample() {
  /*C2*/
  function addBaseMap(mapName, url) {
    // setup tile source
    var internetTileProvider = new AltusUnified.InternetTileProvider(
      mapName,
      url
    );

    // create map description
    var mapDesc = AltusUnified.VirtualMap.defaultRasterMapDesc();
    var newMap = new AltusUnified.VirtualMap(
      mapName,
      mapDesc,
      internetTileProvider
    );

    // add map to scene
    AltusUnified.scene.addMap(newMap);

    newMap.delete();
    mapDesc.delete();
    internetTileProvider.delete();
  }
  /*C2*/

  function pushToVector(vector, array) {
    var size = array.length;
    for (var i = 0; i < size; i++) {
      vector.push_back(array[i]);
    }
  }

  function deleteElements(array) {
    var size = array.length;
    for (var i = 0; i < size; i++) {
      array[i].delete();
    }
    array.length = 0;
  }

  function addElementsToVectorAndDelete(vector, array) {
    pushToVector(vector, array);
    deleteElements(array);
  }

  /*C3*/
  function requestData(url, onLoad, onError, onTimeout, timeout) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.timeout = timeout || 60000; // default to 60 seconds
    xhr.responseType = "arraybuffer";

    //Handle download timeouts
    xhr.ontimeout =
      onTimeout ||
      function(e) {
        console.log(e);
      };

    //Handle successful downloads
    xhr.onload = function() {
      if (xhr.status == 200 && xhr.response) {
        onLoad(xhr.response);
      } else {
        onError(e);
      }
    };

    //Handle other errors
    xhr.onerror =
      onError ||
      function(e) {
        console.error(e);
      };

    //Send the download request
    xhr.send(null);
  }
  /*C3*/

  /*C4*/
  function createTextureFromImageData(imageData, width, height, mipEnabled) {
    var vector = new AltusUnified.VectorByte();

    pushToVector(vector, imageData);

    var image = new AltusUnified.Image(width, height, vector);
    image.multiplyAlpha();

    var texture = new AltusUnified.Texture(image, mipEnabled);

    vector.delete();
    image.delete();

    return texture;
  }

  /*C4*/

  /*C5*/
  function createTextureFromXhr(response) {
    var byteArray = new Uint8Array(response),
      vector = new AltusUnified.VectorByte(),
      altusImage = new AltusUnified.Image(),
      texture;

    pushToVector(vector, byteArray);

    altusImage.loadFromMemory(vector);
    altusImage.multiplyAlpha();

    texture = new AltusUnified.Texture(altusImage, false);

    vector.delete();
    altusImage.delete();

    return texture;
  }
  /*C5*/

  /*C6*/
  function createCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  /*C6*/

  /*C7*/
  function getImageDataFromCanvas(image) {
    var canvas = altusUtil.createCanvas(image.width, image.height);
    var context = canvas.getContext("2d");

    // Copy the image contents to the canvas
    context.clearRect(0, 0, image.width, image.height);
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
  }

  /*C7*/

  /*C8*/
  function addMarkers(texture) {
    var anchor = new AltusUnified.vec2d(
        texture.getImageWidth() / 2,
        texture.getImageHeight()
      ), //anchor to bottom center
      markers = [
        new AltusUnified.MarkerData(
          0,
          38.889469,
          -77.035258,
          0,
          1,
          "Washington Monument",
          texture
        ),
        new AltusUnified.MarkerData(
          1,
          38.889803,
          -77.009114,
          0,
          2,
          "United States Capital",
          texture
        ),
        new AltusUnified.MarkerData(
          2,
          38.8977,
          -77.0365,
          0,
          3,
          "White House",
          texture
        ),
        new AltusUnified.MarkerData(
          3,
          38.8893,
          -77.050111,
          0,
          4,
          "Lincoln Memorial",
          texture
        ),
        new AltusUnified.MarkerData(
          4,
          38.8957,
          -77.0559,
          0,
          5,
          "Kennedy Center",
          texture
        ),
        new AltusUnified.MarkerData(
          5,
          38.891111,
          -77.047778,
          0,
          6,
          "Vietnam Memorial",
          texture
        ),
        new AltusUnified.MarkerData(
          6,
          38.888,
          -77.02,
          0,
          7,
          "Air & Space Museum",
          texture
        ),
        new AltusUnified.MarkerData(
          7,
          38.89731,
          -77.00626,
          0,
          8,
          "Union Station",
          texture
        )
      ];

    for (var i = 0; i < markers.length; i++) {
      markers[i].anchorPoint_set(anchor);
    }

    var vectorMarkerData = new AltusUnified.VectorMarkerData();
    addElementsToVectorAndDelete(vectorMarkerData, markers);

    var markerMap = new AltusUnified.ClusteredMarkerMap(
      "clusteredMarkerMap",
      vectorMarkerData,
      32,
      20,
      AltusUnified.TargetImageFormat.FOUR_BPP,
      false
    );

    AltusUnified.scene.addMap(markerMap);
    markerMap.setOrder(312);

    vectorMarkerData.delete();
    markerMap.delete();
    texture.delete();
  }
  /*C8*/

  function setPosition(lat, lon, altitude) {
    // create position object
    var pos = new AltusUnified.GeographicPosition(lat, lon, altitude);

    // create orientation object - camera pointed like standard 2D map view
    var orientation = new AltusUnified.Orientation(0, 90, 0);

    // create default scale object
    var scale = new AltusUnified.vec3d(1, 1, 1);

    // set transfrom to scene
    var trans = new AltusUnified.Transform(pos, orientation, scale);
    AltusUnified.scene.camera().transform.set(trans);

    pos.delete();
    orientation.delete();
    scale.delete();
  }

  /*C9*/
  function addMarkersFromEncodedData() {
    var image = new Image();

    image.onload = function() {
      var imageData = getImageDataFromCanvas(image);
      var imageBytes = new Uint8Array(imageData.data);

      var texture = altusUtil.createTextureFromImageData(
        imageBytes,
        image.width,
        image.height,
        true
      );
      addMarkers(texture);
      texture.delete();
    };

    image.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAImxJREFUeNrt3XmYZWV94PFv9UY3TdPsDc3SLM3WzSYIDKCAhERHRGGIJM4IRhJxomZQNEFg8hg1OMboqA8+E3FcEkmighug0XFBo0gAN7ZukEWgm7UX6JXeu+aPt651q7q6qu6955zfWb6f5/k9BU1z7++te+95f/c97wKSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSVFtHAN8H1gI3A/tEJyRJkvJ1ErAa6G+LxcC+0YlJkqR8zAaeZWjn34o7gcnRCUqSpOzdyMidfyuuik5QkiRl63RG7/z7gVU4H0CSpFq5nbELgH7g49GJSpKkbJzB+Dr/1ijALtEJS5Kk3t3E+AuAfuAvoxOWJEm9ORDYQmcFwKPAhOjEJWXLD7XULG+i88/9wcDLoxOXJEnde5jOvv234vPRiUuSpO6cRHedfz+wAtghugGSsuMtAKk5/qiH/3cm8AfRDZAkSZ3rdvi/FZ+LboAkSerM4fTW+fcDS3DUUKoNP8xSM7w6g8fYEzg+uiGSsmEBIDVDVvfvnQcgSVJFTAbW0PstgH7gR9GNkSRJ43Mq2XT+/cCLwJToBknqnbcApPo7I8PHmgYcG90gSb2zAJDqL+ttfE+ObpCk3lkASPXWR7oFkKXTohslSZJGdxjZ3f9vxRPRjZLUO0cApHo7KYfHPADYL7phknpjASDV24k5Pe4p0Q2T1BsLAKnejsnpcfMYWZBUIAsAqd6OzOlx8yosJElSj3Yl+wmArVgU3ThJvXEEQKqvI3J87P2AGdENlNQ9CwCpvvIsAPpIRwxLqigLAKm+8u6g85pfIKkAFgBSfeU5AgAWAFKlWQBI9WUBIElSw0wBNpHfKoB+4MHoRkqSpKHyOANgeGwEJkc3VFJ3vAUg1dP+BTzHZNK5AJIqyAJAqqeiOmYLAKmiLACkeirqtL4iRhok5cACQKqnfQt6HgsAqaIsAKR6KqoAKGqkQVLGLACketqzoOeZHd1QSd2xAJDqaY+CnqeoQkNSxiwApHqyAJA0qr7oBCRlbgqwoaDnWgXMjG6wpM45AiDVz24FPtcMUsEhqWIsAKT62bnA5+qj2IJDUkYsAKT6mVHz55OUAQsAqX52qvnzScqABYBUP0V3yI4ASBVkASDVjwWApDFZAEj1M63g55se3WBJnbMAkOpnUsHPNzm6wZI6ZwEg1U/RBUDRzycpAxYAUv04AiBpTBYAUv1YAEgakwWAVD8Ta/58kjJgASDVz5aaP5+kDFgASPWzueDn2xTdYEmdswCQ6scCQNKYLACk+im6ACj6+SRlwAJAqp+iv5E7AiBVkAWAVD9rC36+NdENltQ5CwCpflbX/PkkZcACQKqfor+RWwBIFWQBINVP0R3yqugGS+qcBYBUP0UXAM4BkCqoLzoBSZnbGVhZ0HNtBabgboBS5TgCINXPKmBjQc/1PHb+UiVZAEj1tKyg51kS3VBJ3bEAkOrJAkDSqCwApHpaWtDzFFVoSMqYBYBUT0/W7HkkZcwCQKqnojrmxdENldQdCwCpniwAJI3KAkCqp6I6ZgsAqaIsAKT6OQx4TUHPNTG6sZIkNdlewBXAAqC/4PgFcBmwW/QvQZKkppgDfAp4keI7/uGxAvg0cGT0L0WSpLo6EbiFtA1vdMc/UtwGnIvnjUiSlIm5wA2Ut+MfqRA4J/qXJklSVc0Cvkh1Ov7hcSdwavQvUZKkqpgK/A2wmvhOvNfYShq9mBP9S5UkqcxOAe4jvuPOOlYClwOTon/BkiSVye6k4f6txHfWecZDwJnRv2xJksrgYuAZ4jvnIm8LXAfsHP2LlyQpwgzgH4nvkKPiMeCs6BdBkqQinQ4sIr4Tjo7WaMCO0S+IJEl5mgx8kuou7csr7geOiX5xJEnKw77ArcR3tmWNVcCfRL9IkiRl6WxgGfGdbBXiS3hLQJJUA1cAm4nvWKsUv8bNgyRJFTUN+BfiO9OqxlLgFdEvoiRJndgL+CnxnWjVYx1pnwRJkkrvWOAp4jvPOsUngQnRL6wkSdtzBvA88R1mHeOrpNsqkiSVyhuA9cR3lHWO24E9ol9oSZJa/hxn+hcVdwOzo19wSZI+THyn2LRYBMyNfuElSc1l5x8Xi4FDo98AkqTm+QjxnWDT4xlgXvQbQZLUHH9PfOdnpHgWmB/9hpAk1d/fEN/pGUNjMXBw9BtDklRfVxPf2RnbLwLmRL9BJEn1807iOzlj9HgImBX9RpEk1ccbgC3Ed3DG2HEXMCP6DSNJqr5zgI3Ed2zG+ONWYGr0G0eSVF0nAquJ79CMzuOL0W8eqWwmRicgVcRc4MfALtGJqCvHDvz89+hEJEnVsSvwAPHfYo3eYivwx9FvJklSNUwhffOP7ryMbOJF4KToN5Ukqfw+S3ynZWQbTwP7Rr+xJEnl9TbiOysjn/gJMDn6DSZFchKgNLKzgX8BJkQnolzMAWYC341ORIpiASBtazbw/3ADmbo7GVg4EFLj9EUnIJXMJOAHwBnRiagQa0j7OzwYnYhUNIc3paGuwc6/SXYCbgB2jE5EKpq3AKRBrwY+hSNjTTOLtMHTv0UnIhXJC52UzAbuBXaPTkQh+knnPHwnOhGpKBYAUvoc/AA4KzoRhVoKHAUsiU5EKoJzACT4C+z8BXsC10UnIRUlixGAacDhwB4D//4isIxUTb8Q3UBpDHOBu4Hp0YmoNC4Avh6dhDRgV1JxugeDk1WXAg8B63p54G4KgOnAa4DXkpbPzB3lcV4A7gcWAPeR1tveBywv9NcnjWwiaUe4U6MTUal4K0ARdgeOBuaT3n+tn7tu5+/3Aw8DPwduBr4NrO3kCTspAHYjDZX+Bb1PlHqWwcLg/oFYCKzK7Fcpje1K4EPRSaiUbgQujE5CtbQzMI+hnf1RpNUovVgOfJK0kmlco+/jKQCmAe8F3kX+O6M9TioEWkXBgoF/X5/z86p5DgfuAXaITkSl9SrSjpBSN6YBRzL02/x80jbUeVoFfBj4CLBltL84VgFwLPBV0jB/lC3Ab0m3DtpHDB4GNgXmpepy1r/G42HgGPwCotFNBg5j8Jv8fNK3+4OI3WvnZ8BFwGPb+wujFQCvBL5GeSdHbQR+w+D8glZx8BiwNTo5ldpFwBejk1AlvA/4QHQSKoUJwMGkzr19CP9wynuy5CrgD4Hvj/Qft1cAvJZ0D2xKdPZd2AwsIt06aN1C+CVpr+8tPTyu6mFP0ntht+hEVAkbSaMAv4lORIWZCBwBnEDq6OcP/DyAdFZI1WwkFQG3DP8PIxUAryDNJpwWnXXGVrDtpMP7SDN+1RzXAZdGJ6FK+TZp5ZPqZxZD79EfRersZ0YnlrEXgf9MWvX0O8MLgL1I26H2OhuxSpYweAuhVSAsAFZGJ6bMnQLchhtgqXPn4FkBVbYL207GO5rB/WuaYClwPPBk6w/aC4A+0hDBOdFZlsQihhYErVGDnjZeUJg+4E7S3hVSp+4FXoLzi8puOukbfHsnPw/YLzqxkrgVOJu0h8CQAuBPgc9GZ1dyWxlckdC6hbCAdH/QFQnl9gbgX6OTUKVdBPxzdBIC0vy0I9l2Pf2BOMI3lkuAL8BgATCNtORl3+jMKmoTgysS2nc+fAwnHpbBDsADpGU5UrceI00O2xidSINMAg5hsJNvdfSHUs0JeWWwiLRscUOrALgUD8HIgysSyuEK0sYYUq/eA3wsOokamspgB98+834OsWvp6+pPgc+3CoA7gZOiM2qQVQxdkdAaMXDv8eztCjyCy/6UjaWkb6SroxOpsNkMvT/f+rlTdGINcjtwWh+pwnqMbE4GVG+WMXRTo9bPFdGJVdhHgXdHJ6FauRrPkBiP3dl2Mt5RWIyXQT9wQB/wVuDT0dloVE+y7YmKD9DhyU8NtDepuJ0anYhq5TnSZDO3CE5mMPLhNntHJ6ZRvWUScHJ0FhrTfgPxyrY/20rq3FrLE+8d+PkgTlJqeRd2/sreLOBNNG/e1FQG78+3r6c/MDoxdeWUPuAuXBtdN88wOOmw9fNXpN2gmmIP0umSZT3LQtX2GGkm9eboRHIwnbTnQftkvPnAPtGJKVN3TiLtb6x62Wcgzm77s/Wk2wbDJx8+Hp1sTv47dv7Kz0HAeaTTUqtqwkA7RjrcpornwKgz+/cBG/DFbrJNpD0gho8YPEB1dz2bQSpsnGykPN1D+qbcH53IGOp2uI2y8WIfaT26OydpuOUMXaLYGjl4ITqxcXgn8PHoJNQIZzDsgJVge7LtZLz51O9wG/VuYx+wBodKNX5PM7QoaK1IWBOd2ICJpO2avbWlIvwzaYvgou3CtpPxjiYVANJ4rOgjTWY5MDoTVVo/aci9fcSgdRthQ8G5vIYRzr2WcrKOtIV6XiNjOzLy4Tb7RzdclffQJNIe9gdGZ6JK6yNNJjoIOHfYfyt6RcLbon8ZapRppCWBn+jxcXYCjmPb+/S7RjdQtfVQH/B3wF9FZ6JG2UAaHWg/UfF+0ihCLxOq9ieNaLl3uIp0D6nzHo+JDD3cpvXN/lBgcnRD1Cgf6iMtFft+dCYSaUXCYgYPTep0RcLfkrZplYp2KvAfbf++A4OduzPvVUZn9pHeqEtJS6ekMnqBodsgt0YMlrf9nUmkEQSPtFaEm4AfM/Q+vddUldULwKzWAUCfAd4SnZHUoWcZ3NSon7T1ryRpdP8HeHurAHgJacjVEwElSaqvftKclXtbGwD9mmpvaSlJksb2ZdLhcUO+8R9Gms3q6WmSJNXPOtIclUdh6HKp5aSTrc7u4kElSVK5XQ18q/Uvw9dL387gchVJklQPNwCXt//BSJP+ZgI/Ik0MlCRJ1fYL4CxgdfsfjnQK4ErgVQxMEpAkSZV1N/BqhnX+sP1jgJcALwNujs5ckiR15RvAy0mb/W1jrHX/fcBlwP/C1QFSVp4mHcK1GHgCWBudUAnsTTrLYX/gWNIOpZK6sx64AriWUc5XGe/GP3OADwF/zPZHDSRt32Lg/wLfJu270cuhR3U3Hfh94Hzgv+Le+dJ4bSGt878KWDTWX+50579DgHcAr8c916XxWEEaQbuWtAZXnTmc9Ps7PzoRqcSeJG3mdy3w2/H+T91u/dsHHA+cDpxCOvXqUKzUpXb3A+eSDilSb/4EuA6YEp2IFGwz8DDp+vIfwE+AX9HFqGKWe/9PAY5g6BnXRwEH4W0DNc/3SCNlq6ITqZHTgW8Cu0YnIhVgK/AYqaNvnYTaOh59YxZPUMThP5NIZ2C3n4t9Amlob2IPjyuV1e3A75Em4ihbpwI/xEnJqo8tpEnBvyQddb5w4Oci0rf93ESe/jeTVBAcxdARg1mBOUm9ehI4CXgmOpEaezPw+egkpC48R/pGv6Dt5wLS/juFK+PxvzsAc0mjBK0Rg3mkWwllzFdqdwHw9egkGuA7pA3LpLLpJw3dt77JLyR9u38E2BCdXLsqdagzSYXB8FsJ+0QnJg24HTgtOomGOIa0nNL5RYr0LIP36FtD+I8Q9I2+U1UqALaX/xwGbx8cRSoO5uE9QhXPb//FchRARVlPmnw3fOj+cSq8p0fVC4DRzGboLYT5pB3GdopOTLW0FtgT1/oX6c9ImytJWVkD3MPQyXgLSbt31k6dC4DtaS8MWvMM5gHTohNTpd0EnBedRMPsRZps6W0AdWodqWNvH7qvbUe/PU3cuOfpgfhB259NA45k8FbCZbgXuTrzy+gEGmgJadezudGJqPQ2Ap9gcAj/ARyta+QIwHgsB3aLTkKV8mfA56KTaCDnAWg8VuAGUttw6Cw7pVreocK57j/GiugEVDivtRlp4i2AvBwNLGPopMN5wHHAHtHJKXeToxNoKHcTra9lwN0MnYy3gDQ6+0h0cnVgAZCtF4DbBqJlEukUxfbdDucDh+Hvv07cjyLG7tEJqGfth9u0ltfdBzzKyFvhens2I3ZA+dtM2uf5N8DX2v68dXjSPNLoQeunhydVkwVADCcAVkf74TatTn4h8CAZHW6jzlgAxNkI3DsQX277cw9PqqYzoxNooMNJnxWVS9jhNuqMBUD5bCYtbfotcEvbn08m3TYYvrnREThiUAankTYCWhqdSIOcF51Aw20lfXsfvmnOQ8Cm6OQ0NguA6tjE4P2xG9v+fHeG3kJonbDofbJiTQTOBz4TnUiDXBCdQIM8z9D7863z6ZdHJ6buuQ/AyLrZB+Aw0kSWsvDwpOI9DRwKvBidSANcAHw1OokaeoZth+7LdrjNIXS+CmAF7gOgcVpOOuChkzg0OulxmNJFu4zO4vLoF7kBJpImkkW/1nWMKmyJfkgX7XohOuky8t6xlK1rgJOik6i5j5JGtCT1wDkAGo+3k5YnHk268O4XnVCJTQVuAE7ECYF5+G/AO6OTKKmnGLxH/wjwD9EJqdwsADQe1wOr2/59FwY3NTqKwQmIe0YnWhJzSIdNnUda96xsXIyTLCFNyGtNxLuXwQNu2oe5d8QCQGOwAFA3VgA/G4h2ezF0x8PWP8+MTjjAMcBdwB8Bt0YnU3FTgA8D74pOpGBrGZxtv6DtZ6OOrJWKMhV4B+mwiU4nmfwQOCu6AWPodhLgjB6fd3/SiW3vAb4A/Jx0cYue8FREbAW+gjvWdaMPuJA0nB39OuYZG4B7gH8FrgReCxxMb6u0duwyl7JPAjyLdK3ttF0bSdf2qdENUDldQqqse/0w3wYcGd2Y7YgqAEYygTSb93XAVcCXSBfBboqvKsQG4JvAW4DZBbzWVTUBOBn4IOkbb/TrlmW09rz/2kD7LiTdPsvjIKm6FQDzSCOOvb4GT5Ou9cJ9ACDdz/4M8PoMH3M98NfAx0hvurKYCqzr4v/bjzTBqAiTSHsqtB+cdDSpWKjTVsiLSd9st0QnUiIzSK/3TtGJZGQz8HEG79EvpLvPXzf2obtbBTuRRufKoo80cvgBsv32fiNwKR4n3Wj7kz6UeVX811GOTmsy8GbSt49u2rGatPQq8pvrDsBLgDeSjgiN/jZnGGPFk3l8EMYwm/RZXdVlzg+TrhVlON56IunLWV6vz0Jc0dRYc4EnyP8i8CVi91s4iuyGUlcBbyV+5OjajNpjGHnGXXl9AEbQR/pG223HPzzuJXavhQmkQ9Lyfo0ex/k5jbMz8ADFXQjeH9TOS0jb0mbdnu8QO7P/yhzaZBhZx015fQCGmUn6TGad/4uk0YAIH8ihPduLhaQ+QQ3xDYq9EGwFzi24jVfn3KZ7gH0LblPLxTm3zTCyiE/n9QFosy/ps5hnO64qoB3tziVdM4t8rb5RcBsV5HxiLgZPANMLauP7CmrTQ8QcsHF2Qe0zjF7iyrw+AAN2pft5PZ3GX+fclpbpwKKg1+v8gtqoIFOBR4m7IFxTQBvPo9jq+bsUP9Hx4ALbZxjdxh/m9QEgfea+W2BbtpKuLXn7UODr9QhpsrFq6s3EXhBWks+a+pb9yG4SUCfx3uJeQiBd/NYHtNMwOonjcnr/A1wR0J5V5DtrfgYx16/2eFOO7VOwnxN/UXh7ju37SlCbXiQdFlSkum0SY9QrtpLffgYHkc/k3vHEl3NqE6Sd+qJftyJXbqhAhxH/5uoHbs+pfSdS/MSZ9ri+wNcSip/IaRidRJ57AFwf2K6twAk5tev2Erxu/aS+ohEi16cX7YzoBAa8lHy+GbyN2PX5FwKzCny+BYFtlcZyd06PO4v0WYvSRz6jmDuRro1lUJa+IndNKgBOi05gwGTglIwfcybZbmXcjSkUu8f2r4LbK43mnpwe9xLSZy3ShWS/bv4UyrH7IJSnr8hdkwqAMg3rHJrx472S4pYYjuZ1BT7Xr6MbK40irwLgtdENI11rXpXxY2Z9TexFmfqKXDWpANg9OoE2e2b8eC+PbtCA40mnkBXhceD56AZL25FHgboj+d1/71TW15wyXZ/3iE6gKE0qACI2rNme3TJ+vKxvKXRrMsVdoPqBX0Q3WBrBEtKa8qydQHmGybO+5pSpAMj6+lxaTSoANkUnkGMuZTpfvsjTtf49urHSCG4jFahZK9PJdVlvA74xukFtytRX5KpJBcDK6ATarMj48cpUsRY5fHZbdGOlEdyR0+OW7VtylquOVkU3qM2K6ASK0qQC4NHoBHLKZTLl2r4yz50Oh7sL2BDdYGmYvArTvDYW6sYUsr0dUabrcx63b0qpSQXAfdEJtLk3w8faRLmGz9YU+Fzrye/bltSNFaQdR/OwNrpxbTaS7XWnTNfnMuWSqyYVALdGJzDgWdL501l6LrpRgbn8W3SDpTY/ADbn9NhLohvXJuvP+YIcHrNbP4xOoChNKgB+QjmWjX2T7CcIPRTdqMBcvhPdYKnNd3N87N9EN65N1p/zfuCm6EYBy4GfRidRlCYVABvJ9yCL8cpjz/w7oxs1YDVwf8HPeR+wOLrhEqkTy7MAWECxt9hGk8ett3+KbhTpQLUy3VLNVZMKAID/TX7Dc+NxG/kcBvS9wDa1+xExS2hujm64RJqU+lSOj78J+HF0Iwfkcc25HfhZYJs2k/qIxmhaAfAo8Lmg5+4HrsrpsX9Kvhee8fpK0PPeEN1wCfhqAc9RhlHMJ8lvpcNV5LOHwnh8lnKtRlAOdiNNxCv6iMkv5Nyu9we0qT2WUNw2wMNNIBVA0ceIGs2Og/J+o5M+Y0uC2/n+nNv4jwFtepZy7aeiHL2SdK51UW+uR8j+9KzhdidtdhR1UXhvUS/ednwisO2GkdfSv5FcGdjOleTfUe5MumYW1aYtpD5BDXIZxby5lgDzCmrT5QW1aXg8AkwtqI3bc2JQ2w2jH3h7/m/x35lGGqqOaOe7CmrjPIob6bisoDapZN5NviMBzwHHFtieSaQVAUVeELYAv1dgG0dzT8FtN4x+YB3FDx+fTfrsFdnOO0jXmKIcQ7qG5tWercB7CmyPSugS0gc46zfXA8DhAe05mLSWtaiLwgcD2rg9lxXYbsNoRdTEvGsKbONyipnjMNwRpGtp1u1ZR7r2SxxNqm6zeGNtBq4Fpge251TStqF5XxSuJ9sDQXq1B2l74OgOwWhWnF3Em3sEfaTPYN7tW0u6pkSZTrqmbs6oPXeQrvnS70wALqK3e2u3kIatyuA08h0JuA6YGN3IEfxTjm02jOGxgNgieCLwmRzbt5x0LSmDY0jX2G7b8ijpGt+05e/qwGTgPOBGYCmjv6G2kvb1/xjl6fjbHULanCTLC8I64M+jGzaK4zJur2GMFmX5LLyN7G9l3kW6hpTNMaRr7kLGnsO1lHQtP49sTy+shTIN35ZRH+me+mHAAcAupN24nifNfF9IOc4XGM1k4K+A/0nvM/V/ClwKPBjdqDHcCrwiOgnV3gpgP8pzSt+RpNGAl/X4OOtJc3v+npidPTuxG2nFwNyBf55Mel0Wkc4r+C2pEJAabV/go3R+W2AL6XSsV1OdgvGcDttoGN3ENUW9oTvQR/qs/pDOVwksI10jZkc3QsWoygVd2ZkC/AFwJnACaZbt3m3/fT2pcl5A2pf7W8AT0Ul3qI+0McsJ0YmottaQZsUvi05kFHOA15Du4c8njWS2jwI+SxrN+yXpjIHv0aCDcCQlE4FdiV25kLVzif+GaNQ3PlLcWzlT00mf9TJO4FXBHAFQXfWRJjG9NDoR1c5a0tygJdGJSL1wOYTqqh+4OjoJ1dJHsfNXDTgCoLq7hXQfVMrCYtIOn+uiE5F65QiA6u4vSTuISVl4H3b+qgkngqjulpH2cDg+OhFV3q+Bd5BuL0mV5y0ANcFM0qZNrm9WtzaTlpXeG52IlBVvAagJVpJuBUjd+hR2/qoZRwDUFH2kLYLPjE5ElfMUaSOdldGJSFlyBEBN0U86CeyF6ERUKf3Axdj5q4YsANQkTwKXRyehSvkH0siRVDveAlATfYt0YJA0mseBY4FV0YlIebAAUBPNIi3p2ic6EZXWJuB04I7oRKS8eAtATfQc8F8o/1nninM5dv6qOTcCUlM9SRoBe0V0Iiqdm4F3RychScrPBNJ8gOijZY3yxELSxlFS7TkHQE03DfgxcFJ0Igq3hPQ+eCI6EakIzgFQ060DXg88E52IQm0C3oCdvyQ1zgmk5V7RQ9BG8bEVeGP0G1CSFOc/AWuI75CMYuOt0W88SVK81wNbiO+UjGLimug3nCSpPC4mHf8a3TkZ+cbfRb/RJEnlcw5pgmB0J2XkE1dEv8EkSeV1HrCe+M7KyDY+GP3GkiSV38nAUuI7LaP32Ai8KfoNJUmqjnnAIuI7MKP7WAucG/1GkiRVz8HAfcR3ZEbn8RxwWvQbSJJUXVOBLxDfoRnjjzvw2GdJUgb6gCtxmWAV4kvA9Og3jCSpXl4KPEx8J2dsG6uBi6LfIJKk+toN+DrxHZ4xGA8Cx0a/MSRJzXAu8BTxnV+TYwNpc5/J0W8GSVKz7AN8k/iOsImxkHSQkyRJYS4gnSkf3Sk2IdaQJmROiX7RJUkC2JF0ypzbCOcXNwD7R7/QkiSNZC7wFWAr8R1mXeJnuKmPJKkiTgRuJb7zrHLcD7wu+oWUJKkbxwFfxE2EOolbgJdFv3CSJGXhWOB6nCOwvdhMWlFxRvQLJUlSHnYGLgV+RXynW4Z4grSWf1b0CyNJUhH6gJcDnwVWEt8RFxkbgZtJyyd3iH4hJEmKsiPwRtIWw6uJ76DzGuL/EfA/gL2if+GSJJXNDsDvA58gzYKv8nLCJaS1+xcDu0f/YiWloUdJ1bAXcOZAnArMByZFJ7Udi4E7gZ+Qvu0vIBUCkkrCAkCqrunACcBJwNHAPOAIYKcCc1hDOha5Fb8A7gKejv7lSBqdBYBUP3OAAwZ+7jsQewO7tMVM0sl504Cpbf/vFmDVwD+/AKwYiJXAMuDxtngMeCa6sZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZI0zP8HnSIDtbdnylQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDYtMTNUMDY6MzY6NDItMDQ6MDCZV8uvAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA2LTEzVDA2OjM2OjQyLTA0OjAw6ApzEwAAACh0RVh0c3ZnOmJhc2UtdXJpAGZpbGU6Ly8vdG1wL21hZ2ljay1wTkVRQ3FMevtZiAAAAAAASUVORK5CYII=";
  }

  /*C9*/

  /*C10*/
  function addMarkersFromImgTag() {
    var image = getMarkerImage(), // window scoped function
      imageData,
      imageBytes,
      texture;
    debugger;
    imageData = getImageDataFromCanvas(image);
    imageBytes = new Uint8Array(imageData.data);

    texture = createTextureFromImageData(
      imageBytes,
      image.width,
      image.height,
      true
    );
    addMarkers(texture);
  }
  /*C10*/

  /*C11*/
  function addMarkersAsync() {
    debugger;
    requestData("../images/blueplane.png", function(response) {
      var texture = createTextureFromXhr(response);
      addMarkers(texture);
    });
  }
  /*C11*/

  return {
    addBaseMap: addBaseMap,
    addMarkersFromEncodedData: addMarkersFromEncodedData,
    addMarkersFromImgTag: addMarkersFromImgTag,
    addMarkersAsync: addMarkersAsync,
    setPosition: setPosition
  };
}

function moveFlight() {
  if (f_lat != undefined && f_lon != undefined && f_alt != undefined) {
    console.log(f_lat + "   " + f_lon + "   " + f_alt);
    //ImageMarkersExample.setPosition(38.889469, -77.035258, 10000);
    ImageMarkersExample.setPosition(f_lat, f_lon, f_alt);
  }

  f_lat -= 1;
  //if (f_alt < 2000) f_alt += 100;
  //if (f_alt > 10000) f_alt -= 100;
}

// Called by the mapping engine after it has initialized
function onAltusEngineReady() {
  (ImageMarkersExample = createImageMarkersExample()),
    (mapName = "MapBox Aerial"),
    (tileProviderUrl =
      "https://a.tiles.mapbox.com/v4/dxjacob.ho6k3ag9/{z}/{x}/{y}.jpg?access_token=pk.eyJ1IjoiZHhqYWNvYiIsImEiOiJwYXotMmtVIn0.rvNzd7EZTKqynbx-9BQdtA");

  ImageMarkersExample.addBaseMap(mapName, tileProviderUrl);

  ImageMarkersExample.addMarkersFromEncodedData();
  //ImageMarkersExample.addMarkersFromImgTag();
  ImageMarkersExample.addMarkersAsync();

  f_lat = 38.889469;
  f_lon = -77.035258;
  f_alt = 10000;

  //Position of camera
  ImageMarkersExample.setPosition(38.889469, -77.035258, 10000);

  AltusUnified.scene
    .atmospherics()
    .setSunLocationType(AltusUnified.LocationType.DIRECTION_VIEW_OFFSET); //no dark side
  AltusUnified.scene
    .atmospherics()
    .setLightingType(AltusUnified.LightingType.REALISTIC); //blue sky

  setInterval(moveFlight, 10000);

  console.log("Version Hash - " + AltusUnified.Scene.versionHash());
  console.log("Version Tag - " + AltusUnified.Scene.versionTag());
}

var f_lat, f_lon, f_alt;
var ImageMarkersExample;
/*C1*/
