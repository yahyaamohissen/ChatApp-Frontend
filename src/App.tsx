import './App.css';
import { Main } from './Main';
import { Provider } from 'react-redux';
import store from './StateManagement/Auth/Store';
import { ThemeProvider } from '@material-ui/core';
import Theme from './Theme';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
      <div className="App">
        <Main />
      </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;