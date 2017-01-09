// This is the app bootstrapper.
// If we're in dev mode, run from src.
process.env.NODE_ENV === 'dev'
    ? require('./src/main').main()
    : require('./build/main').main()
