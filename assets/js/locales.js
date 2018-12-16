(exports => {
    exports.LANGUAGES = {
      portuguese: 'pt',
      english: 'en',
      spanish: 'es',
      keywords: {
        pt: {
          feature: 'Funcionalidade:',
          scenario: 'Cenário:',
          background: 'Contexto:',
          examples: 'Exemplos:',
          but: 'Mas ',
          given: 'Dado ',
          when: 'Quando ',
          then: 'Então ',
          and: 'E ',
          scenario_outline: 'Esquema do Cenário:'
        },
        en: {
          feature: 'Feature:',
          scenario: 'Scenario:',
          background: 'Background:',
          examples: 'Examples:',
          but: 'But ',
          given: 'Given ',
          when: 'When ',
          then: 'Then ',
          and: 'And ',
          scenario_outline: 'Scenario Outline:'
        },
        es: {
          feature: 'Característica:',
          scenario: 'Escenario:',
          background: 'Antecedentes:',
          examples: 'Ejemplos:',
          but: 'Pero ',
          given: 'Dado ',
          when: 'Cuando ',
          then: 'Entonces ',
          and: 'Y ',
          scenario_outline: 'Esquema del escenario:'
        },
      }
    };
  })(typeof exports === 'undefined'? this : exports);
  