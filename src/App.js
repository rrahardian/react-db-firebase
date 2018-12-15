import React, { Component } from 'react';
import fire, { auth, provider, providerFB } from './fire'
import FileUploader from 'react-firebase-file-uploader'

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      nama: '',
      usia: '',
      jenis: '',
      waktu: '',
      progress: 0,
      isUploading: false,
      pictUrl: '',
      allData: []
    }
  }

  LogIn = async () => {
    let result = await auth().signInWithPopup(provider)
    console.log(result)
    this.setState({
      user: result.user
    })
  }

  LogInFB = async () => {
    let result = await auth().signInWithPopup(providerFB)
    console.log(result)
    this.setState({
      user: result.user
    })
  }

  LogOut = async () => {
    await auth().signOut()
    this.setState({
      user: null
    })
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addData = (e) => {
    e.preventDefault()
    const db = fire.firestore()
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection('koleksi kbs')
      .add({
        namanya: this.state.nama,
        usianya: this.state.usia,
        jenisnya: this.state.jenis,
        gambar: this.state.pictUrl,
        waktunya: new Date()
      });
    this.setState({
      nama: '',
      usia: '',
      jenis: ''
    })
  }

  getData = () => {
    const db = fire.firestore()
    let wholeData = []

    db.settings({
      timestampsInSnapshots: true
    });
    db.collection('koleksi kbs')
      .orderBy('namanya', 'asc').get()
      .then(data => {
        data.forEach(doc => {
          // console.log(doc.data())
          wholeData.push(doc.data())
        })
        this.setState({
          allData: wholeData
        })
        // console.log(this.state.allData)
      })
  }

  handleUploadStart = () => {
    this.setState({
      isUploading: true,
      progress: 0
    })
  }

  handleUploadSuccess = (filename) => {
    this.setState({
      progress: 100,
      isUploading: false
    })
    fire.storage().ref('profil-hewan')
      .child(filename)
      .getDownloadURL()
      .then((url) => {
        this.setState({ pictUrl: url })
        // console.log(url)
      })
  }

  handleUploadError = (error) => {
    this.setState({
      isUploading: false
    })
    console.log(error)
  }

  // handleProgress = () => {
  //   this.setState({
  //     progress
  //   })
  // }

  render() {

    let dataList = this.state.allData.map((value, index) => {
      let fotoku = value.gambar
      let namaku = value.namanya
      let usiaku = value.usianya
      let jenisku = value.jenisnya
      return (
        <li key={index}>
          <img src={fotoku} alt='' style={{ width: '40%', height: '40%' }} />
          <br />
          {namaku} ({usiaku}), {jenisku}
        </li>
      )
    })

    // console.log(this.state.pictUrl)

    return (
      <div className="App">
        <div>
          <button onClick={this.LogIn}>
            {this.state.user ?
              <p>{this.state.user.displayName}</p> :
              <p>Log In</p>
            }
          </button>
          <button onClick={this.LogInFB}>
            {this.state.user ?
              <p>{this.state.user.displayName}</p> :
              <p>FB Log In</p>
            }
          </button>
        </div>
        <button onClick={this.LogOut}>Log Out</button>

        <form onSubmit={this.addData}>
          <input type='text' name='nama' placeholder='masukkan nama koleksi' value={this.state.nama}
            onChange={this.updateInput} />
          <input type='number' name='usia' placeholder='masukkan usia koleksi' value={this.state.usia}
            onChange={this.updateInput} />
          <input type='text' name='jenis' placeholder='masukkan jenis koleksi' value={this.state.jenis}
            onChange={this.updateInput} />
          <button>Simpan</button>
        </form>
        <button onClick={this.getData}>Ambil</button>
        <FileUploader
          accept='image/*' name='aang'
          randomizeFilename
          storageRef={
            fire.storage().ref('profil-hewan')
          }
          onUploadStart={this.handleUploadStart}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccess}
          onProgress={this.handleProgress}
        />
        <br />
        <p>Progress: {this.state.progress}%</p>
        <ul>{dataList}</ul>
      </div>
    );
  }
}

export default App;
