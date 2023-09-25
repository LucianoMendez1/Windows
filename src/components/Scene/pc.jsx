import React, { Component } from 'react';
import windowsLogo from '../../assets/img/logo-windows-13475.png';
import powerIcon from '../../assets/img/pngwing.com.png';
import browserIcon from '../../assets/img/hongopng.png';
import textEditorIcon from '../../assets/img/artpalm.png';
import icoCalistenics from '../../assets/img/silueta.jpg';
import psychelic from '../../assets/img/hongo1.png';
import galaxy from '../../assets/img/galaxia.png';
import backgroundGif from '../../assets/img/retro-city.gif'; // Ruta al archivo GIF
import gsap from 'gsap';
/* import appIcon1 from '../../assets/img/artpalm.png'; */
import appIcon2 from '../../assets/img/carpeta.png';
import './pc.css';

class PC extends Component {
  constructor() {
    super();
    this.state = {
      powerOn: false,
      loadingComplete: false,
      executables: [
        { id: 1, name: 'Calisthenics.exe', url: 'https://lucianomendez1.github.io/Calisthenics./', isOpen: false, icon: icoCalistenics },
        { id: 2, name: 'Psychedelic2.0.exe', url: 'https://psychedelic2-0.vercel.app/', isOpen: false, icon: browserIcon },
        { id: 3, name: 'Art Palm.exe', url: 'https://ecommerce-art-git-master-lucianomendez1.vercel.app/', isOpen: false, icon: textEditorIcon },
        { id: 4, name: 'Psychedelic1.0', url: 'https://lucianomendez1.github.io/Psychodelic/', isOpen: false, icon: psychelic },
        { id: 5, name: 'Galaxy', url: 'https://galaxy-wheat.vercel.app/', isOpen: false, icon: galaxy },
      ],
      openWindows: {}, // Usar un objeto para las ventanas emergentes
      searchQuery: '', // Nuevo estado para la barra de búsqueda
      isSearchBarOpen: false, // Nuevo estado para controlar si la barra de búsqueda está abierta
    };
    this.pcStartupRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.state.powerOn) {
        this.startupAnimation();
        setTimeout(() => {
          this.loadingCompleteAnimation();
        }, 2000);
      }
    }, 2000);
  }

  togglePowerOn = () => {
    this.setState({ powerOn: true }, () => {
      this.startupAnimation();
    });
  };

  togglePowerOff = () => {
    this.setState({ powerOn: false, loadingComplete: false });
  };

  toggleSearchBar = () => {
    this.setState((prevState) => ({
      isSearchBarOpen: !prevState.isSearchBarOpen,
    }));
  };

  startupAnimation = () => {
    gsap.fromTo(
      this.pcStartupRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2, ease: 'power4.out' }
    );
  };

  loadingCompleteAnimation = () => {
    gsap.fromTo(
      '.background',
      { opacity: 0, backgroundImage: `url(${backgroundGif})` }, // Usa el archivo GIF como fondo
      { opacity: 1, duration: 0.1, ease: 'power4.out', onComplete: () => {
        this.setState({ loadingComplete: true });
        gsap.to(this.pcStartupRef.current, { opacity: 0, duration: 0.1 });
      }}
    );
  };

  openUrl = (url) => {
    window.open(url, '_blank');
  };

  toggleExecutable = (id) => {
    const updatedExecutables = [...this.state.executables];
    const executable = updatedExecutables.find((exe) => exe.id === id);

    if (executable && !executable.isOpen) {
      // Si se abre el ejecutable, agregamos una nueva ventana emergente
      const newWindow = (
        <div className="popup-window" key={id}>
          {/* Contenido de la ventana emergente */}
          <div className="popup-header">
            <div className="popup-title">
              <img src={executable.icon} alt={executable.name} className="executable-icon" />
              {executable.name}
            </div>
            <div className="popup-close" onClick={() => this.closeWindow(id)}>
              X
            </div>
          </div>
          <iframe src={executable.url} className="popup-content" />
        </div>
      );

      executable.isOpen = true;
      this.setState((prevState) => ({
        executables: updatedExecutables,
        openWindows: {
          ...prevState.openWindows,
          [id]: newWindow, // Usa el ID como clave
        },
      }));
    } else if (executable) {
      // Si se cierra el ejecutable, eliminamos la ventana emergente
      this.closeWindow(id);
    }
  };

  closeWindow = (id) => {
    const updatedExecutables = [...this.state.executables];
    const executable = updatedExecutables.find((exe) => exe.id === id);

    if (executable) {
      executable.isOpen = false;

      this.setState((prevState) => {
        const openWindows = { ...prevState.openWindows };
        delete openWindows[id]; // Elimina la ventana usando el ID como clave
        return { executables: updatedExecutables, openWindows };
      });
    }
  };

  // Método para manejar cambios en la barra de búsqueda
  handleSearchInputChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  render() {
    return (
      <div className={`pc ${this.state.powerOn ? 'power-on' : ''}`}>
        <div className="background"></div>

        {!this.state.powerOn && (
          <button className="power-on-button" onClick={this.togglePowerOn}>
            <img className="power-icon" src={powerIcon} alt="Power Icon" />
          </button>
        )}

        {this.state.powerOn && (
          <div className="power-off-button-container">
            <button className="power-off-button" onClick={this.togglePowerOff}>
              Apagar
            </button>
          </div>
        )}

        {this.state.powerOn && !this.state.loadingComplete && (
          <div className="power-off-message">
            {/* Agrega contenido para la pantalla de apagado si es necesario */}
          </div>
        )}

        <div
          className={`pc-startup ${this.state.powerOn ? 'active' : ''}`}
          ref={this.pcStartupRef}
        >
          {!this.state.loadingComplete && (
            <div className="loading-animation">
              <div className="loading-circle"></div>
            </div>
          )}

          <img className="startup-logo" src={windowsLogo} alt="Windows Logo" />
        </div>

        {/* Barra de navegación */}
        {this.state.powerOn && this.state.loadingComplete && (
          <div>
            <div className="navigation-bar">
              {/* Barra de búsqueda */}
              <div className={`taskbar-search ${this.state.isSearchBarOpen ? 'open' : ''}`}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={this.state.searchQuery}
                  onChange={this.handleSearchInputChange}
                />
              </div>

              {this.state.executables
                .filter((executable) =>
                  executable.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
                )
                .map((executable) => (
                  <div
                    className={`folder ${executable.isOpen ? 'open' : ''}`}
                    key={executable.id}
                    onClick={() => this.toggleExecutable(executable.id)}
                  >
                    <img src={executable.icon} alt={executable.name} className="executable-icon" />
                    <p className="executable-name">{executable.name}</p>
                  </div>
                ))}
            </div>

            {/* Ventanas emergentes */}
            <div className="popup-windows">
              {Object.values(this.state.openWindows)}
            </div>

            {/* Barra de tareas */}
            <div className="taskbar">
              {/* Agrega el ícono de Windows a la barra de tareas */}
              <div className="taskbar-icon" onClick={this.toggleSearchBar}>
                <img src={windowsLogo} alt="Windows Logo" />
              </div>

              {this.state.isSearchBarOpen && (
                <div className="taskbar-search">
                  <input
                    type="text"
                    placeholder="Escribe aquí para buscar."
                    value={this.state.searchQuery}
                    onChange={this.handleSearchInputChange}
                  />
                </div>
              )}

              {/* <div className="taskbar-icon1" onClick={() => this.openApp(appIcon1)}>
                <img src={appIcon1} alt="App 1" />
              </div> */}

              <div className="taskbar-icon2" onClick={() => this.openApp(appIcon2)}>
                <img src={appIcon2} alt="App 2" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PC;
