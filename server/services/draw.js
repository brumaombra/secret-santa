export const drawPairs = data => {
    // Get the language
    let lang = data.lang || 'en'; // Imposta "en" come valore predefinito se decoded_data['lang'] è undefined o falsy
    const allowedLanguages = ['en', 'it', 'es', 'de', 'fr']; // Elenco delle lingue consentite
    if (!allowedLanguages.includes(lang))
        lang = 'en'; // Imposta un valore predefinito se la lingua non è nell'elenco

    // Check the data values
    const partecipanti = data.partecipanti || [];
    if (!partecipanti || !Array.isArray(partecipanti)) {
        return {
            code: '02',
            message: translations['message.required.fields'] // Invia un messaggio di errore in base alla lingua
        };
    }

    // Validate the emails and the names
    partecipanti.forEach(partecipante => {
        const email = partecipante.email;
        const nome = partecipante.nome;
        const isValidEmail = email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
        if (!isValidEmail || !nome) {
            return {
                code: '03',
                message: `${translations['message.data.not.valid.1']} ${nome} ${translations['message.data.not.valid.2']}`
            };
        }
    });

    let list = assegnaRegali();
}

// Estraggo persona casualmente
const scegliCasuale = lista => {
    const indiceCasuale = Math.floor(Math.random() * lista.length);
    return lista[indiceCasuale];
}

// Prendo un destinatario valido
const scegliDestinatarioValido = (persona, lista, regaliFatti) => {
    const destinatariValidi = lista.filter(p => !persona.esclusi.includes(p.id) && !regaliFatti.includes(p.id) && p.id !== persona.id && (p.destinatario === null || p.destinatario !== persona.id));
    if (destinatariValidi.length === 0) return null;
    return scegliCasuale(destinatariValidi);
}

// Eseguo l'estrazione
const assegnaRegali = persone => {
    let regaliFatti = [];
    let success = false;
    let count = 0;
    const maxTentativi = 100000; // 100 mila tentativi massimi
    persone.sort((a, b) => b.esclusi.length - a.esclusi.length); // Ordino la lista di partecipanti

    // Ciclo finché non ho estratto tutti i regali
    while (!success) {
        regaliFatti = [];
        persone.forEach(persona => persona.destinatario = null);
        count++;

        // Estraggo i regali
        for (let i = 0; i < persone.length; i++) {
            const persona = persone[i];
            const destinatario = scegliDestinatarioValido(persona, persone, regaliFatti);
            if (destinatario) {
                regaliFatti.push(destinatario.id);
                persone[i].destinatario = destinatario.id;
            } else {
                break;
            }
        }

        success = regaliFatti.length === persone.length;
        if (count > maxTentativi) return false;
    }

    return persone;
}
