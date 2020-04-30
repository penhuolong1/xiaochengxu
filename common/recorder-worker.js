// import InlineWorker from 'inline-worker'

var HZRecorder = function (stream, config) {
  config = config || {};
  config.sampleBits = config.sampleBits || 16;      //采样数位 8, 16
  config.sampleRate = config.sampleRate || (14000);   //采样率(1/6 44100)
  var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;
  if (AudioContext) {
    var context = new AudioContext()
  } else {
    alert("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
  }
  var audioInput = context.createMediaStreamSource(stream);
  var createScript = context.createScriptProcessor || context.createJavaScriptNode;
  var recorder = createScript.apply(context, [4096, 1, 1]);

  var audioData = {
    size: 0,        //录音文件长度
    buffer: [],    //录音缓存
    inputSampleRate: context.sampleRate,   //输入采样率
    inputSampleBits: 16,       //输入采样数位 8, 16
    outputSampleRate: config.sampleRate,    //输出采样率
    oututSampleBits: config.sampleBits,     //输出采样数位 8, 16
    emptydatacount: 0,
    emptyCheckCount: 0,
    emptyData: true,

    input: function (data) {
      this.buffer.push(new Float32Array(data));
      this.size += data.length;
    },

    compress: function (iszip) { //合并压缩
      //合并
      var data = new Float32Array(this.size);
      var offset = 0;
      for (var i = 0; i < this.buffer.length; i++) {
        data.set(this.buffer[i], offset);
        offset += this.buffer[i].length;
      }
      if (iszip) {
        //压缩
        // console.log(this.inputSampleRate)
        // console.log(this.outputSampleRate)
        var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
        var length = data.length / compression;
        var result = new Float32Array(length);
        var index = 0, j = 0;
        while (index < length) {
          result[index] = data[j];
          j += compression;
          index++;
        }
        return result;
      }
      else
        return data;
    },
    isEmptyData: function (d) {
      var l = Math.floor(d.length / 10);
      var vol = 0;
      for (var i = 0; i < l; i++) {
        vol += Math.abs(d[i * 10]);
      }
      this.emptyCheckCount++;
      if (vol < 30) {
        this.emptydatacount++;

        if (this.emptydatacount > 10) {
          if (!this.emptyData) {
            console.log('stoped');
            this.buffer = []
            this.size = 0
            this.emptyData = true;
          }
          return true;
        }
      } else {
        this.emptydatacount = 0;
        this.emptyData = false;
      }
      return false;
    },
    encodeWAV: function () {
      var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
      // console.log(sampleRate)
      var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
      // console.log(sampleBits)
      var bytes = this.compress(true);
      var dataLength = bytes.length * (sampleBits / 8);
      var buffer = new ArrayBuffer(44 + dataLength);
      var data = new DataView(buffer);

      var channelCount = 1;//单声道
      var offset = 0;

      var writeString = function (str) {
        for (var i = 0; i < str.length; i++) {
          data.setUint8(offset + i, str.charCodeAt(i));
        }
      }

      // 资源交换文件标识符 
      writeString('RIFF'); offset += 4;
      // 下个地址开始到文件尾总字节数,即文件大小-8 
      data.setUint32(offset, 36 + dataLength, true); offset += 4;
      // WAV文件标志
      writeString('WAVE'); offset += 4;
      // 波形格式标志 
      writeString('fmt '); offset += 4;
      // 过滤字节,一般为 0x10 = 16 
      data.setUint32(offset, 16, true); offset += 4;
      // 格式类别 (PCM形式采样数据) 
      data.setUint16(offset, 1, true); offset += 2;
      // 通道数 
      data.setUint16(offset, channelCount, true); offset += 2;
      // 采样率,每秒样本数,表示每个通道的播放速度 
      data.setUint32(offset, sampleRate, true); offset += 4;
      // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8 
      data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
      // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8 
      data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
      // 每样本数据位数 
      data.setUint16(offset, sampleBits, true); offset += 2;
      // 数据标识符 
      writeString('data'); offset += 4;
      // 采样数据总数,即数据总大小-44 
      data.setUint32(offset, dataLength, true); offset += 4;
      // 写入采样数据 
      if (sampleBits === 8) {
        for (var i = 0; i < bytes.length; i++ , offset++) {
          var s = Math.max(-1, Math.min(1, bytes[i]));
          var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
          val = parseInt(255 / (65535 / (val + 32768)));
          data.setInt8(offset, val, true);
        }
      } else {
        for (var i = 0; i < bytes.length; i++ , offset += 2) {
          var s = Math.max(-1, Math.min(1, bytes[i]));
          data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
      }

      return new Blob([data], { type: 'audio/wav' });
    }
  };

  function floatTo16BitPCM (output, offset, input) {
    for (var i = 0; i < input.length; i++ , offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  function writeString (view, offset, string) {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  //开始录音
  this.start = function () {
    audioInput.connect(recorder);
    recorder.connect(context.destination);
  }

  //停止
  this.stop = function () {
    recorder.disconnect();
  }

  this.clear = function () {
    audioData.buffer = []
    audioData.size = 0
  }

  //获取音频文件
  this.getBlob = function () {
    this.stop();
    return audioData.encodeWAV();
  }

  //回放
  this.play = function (audio) {
    audio.src = window.URL.createObjectURL(this.getBlob());
  }

  this.getHexData = function () {
    return audioData.compress(true);
  }
  this.recorder = recorder
  this.audioData = audioData
  //音频采集
  recorder.onaudioprocess = function (e) {
    // console.log(e.inputBuffer.getChannelData(0))
    audioData.isEmptyData(e.inputBuffer.getChannelData(0));
    console.log(e.inputBuffer.getChannelData(0));
    if (audioData.emptyData) return;
    audioData.input(e.inputBuffer.getChannelData(0));
    //record(e.inputBuffer.getChannelData(0));
  }
}

//抛出异常
HZRecorder.throwError = function (message) {
  alert(message);
  throw new function () { this.toString = function () { return message; } }
}

export default HZRecorder
