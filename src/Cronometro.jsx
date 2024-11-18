import { useState, useEffect } from 'react';
import './Cronometro.css';

function Cronometro() {
    // Declaramos el estado para el tiempo total (en milisegundos)
    const [tiempo, setTiempo] = useState(0); // Tiempo en milisegundos
    // Estado para controlar si el cronómetro está activo o no
    const [isActivo, setIsActivo] = useState(false);
    // Array donde vamos a guardar los tiempos parciales
    const [tiemposGuardados, setTiemposGuardados] = useState([]);
    // Array para guardar las diferencias entre los tiempos parciales 
    const [diferencias, setDiferencias] = useState([]);

    // useEffect para manejar el cronómetro cuando está activo
    useEffect(() => {
        let intervalo = null;
        // Si el cronómetro está activo, actualizamos el tiempo cada 10ms
        if (isActivo) {
            intervalo = setInterval(() => {
                setTiempo(prevTiempo => prevTiempo + 10); // Sumamos 10ms al tiempo cada 10ms
            }, 10);
        } else if (!isActivo && tiempo !== 0) {
            // Si no está activo, limpiamos el intervalo
            clearInterval(intervalo);
        }
        // Limpiar intervalo cuando el componente se desmonte o el estado cambie
        return () => clearInterval(intervalo);
    }, [isActivo, tiempo]);

    // Función para alternar el estado del cronómetro (iniciar/pausar)
    const manejarIniciarPausar = () => {
        setIsActivo(!isActivo); // Cambia el estado de isActivo
    };

    // Función para reiniciar el cronómetro y limpiar los tiempos guardados
    const manejarReiniciar = () => {
        setIsActivo(false); // Pausa el cronómetro
        setTiempo(0); // Reinicia el tiempo total
        setTiemposGuardados([]); // Borra los tiempos parciales guardados
        setDiferencias([]); // Borra las diferencias entre vueltas
    };

    // Función para guardar el tiempo parcial cuando el usuario presiona el botón
    const manejarGuardarTiempo = () => {
        // Si hay tiempos guardados, calculamos la diferencia con el último guardado
        const ultimaDiferencia = tiemposGuardados.length > 0 ? tiempo - tiemposGuardados[0] : 0;
        
        // Agregamos el nuevo tiempo al principio de la lista de tiempos
        setTiemposGuardados([tiempo, ...tiemposGuardados]);
        
        // Guardamos la diferencia entre el último tiempo guardado y el nuevo tiempo
        setDiferencias([ultimaDiferencia, ...diferencias]);
    };

    // Función para formatear el tiempo en formato MM:SS:SSS (Minutos:Segundos:Milisegundos)
    const formatearTiempo = (tiempoEnMs) => {
        const minutos = Math.floor(tiempoEnMs / 60000); // Calculamos los minutos
        const segundos = Math.floor((tiempoEnMs % 60000) / 1000); // Calculamos los segundos
        const milisegundos = tiempoEnMs % 1000; // Obtenemos los milisegundos restantes
        return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}:${String(milisegundos).padStart(3, '0')}`;
    };

    // Función para formatear las diferencias de tiempo entre las vueltas
    const formatearDiferencia = (diferencia) => {
        return formatearTiempo(diferencia); // Reutilizamos la función de formateo para la diferencia
    };

    return (
        <div className="cronometro-container">
            <h1>CRONÓMETRO</h1>
            <div className="cronometro-screen">
                {formatearTiempo(tiempo)} 
            </div>
            <div className="cronometro-buttons">
                <button onClick={manejarIniciarPausar}>
                    {isActivo ? 'Pausar' : 'Iniciar'}
                </button>
                <button onClick={manejarReiniciar} disabled={tiempo === 0}>
                    Reiniciar
                </button>
                <button onClick={manejarGuardarTiempo} disabled={tiempo === 0}>
                    Parcial
                </button>
            </div>
            {tiemposGuardados.length > 0 && (
                <div className="tiempos-guardados">
                    <h2></h2>
                    <ul>
                        {/* Revertimos el orden de los tiempos guardados para que se apilen de abajo hacia arriba */}
                        {tiemposGuardados.map((tiempoGuardado, index) => (
                            <li key={index}>
                                <strong>#{tiemposGuardados.length - index}</strong>: {formatearTiempo(tiempoGuardado)} 
                                {index > 0 && (
                                    <span> ({formatearDiferencia(diferencias[index - 1])})</span> // Mostramos la diferencia entre la vuelta actual y la anterior
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Cronometro;
