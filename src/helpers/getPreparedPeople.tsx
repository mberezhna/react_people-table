import { Person } from '../types/Person';

interface Params {
  centuries: string[];
  query: string;
  sex: string;
  sortField: keyof Person;
  order: string;
}

export function getPreparedPeople(
  people: Person[],
  params: Params,
): Person[] {
  let preparedPeople = [...people];

  const {
    centuries,
    query,
    sex,
    sortField,
    order,
  } = params;

  if (centuries.length) {
    preparedPeople = preparedPeople.filter(
      person => centuries.includes(Math.ceil(person.born / 100).toString()),
    );
  }

  if (query.trim()) {
    preparedPeople = preparedPeople.filter(person => {
      const preparedQuery = query.toLowerCase().trim();
      const preparedName = person.name.toLowerCase();
      const preparedMotherName = person.motherName?.toLowerCase();
      const preparedFatherName = person.fatherName?.toLowerCase();

      return preparedName.includes(preparedQuery)
        || preparedMotherName?.includes(preparedQuery)
        || preparedFatherName?.includes(preparedQuery);
    });
  }

  if (sex) {
    preparedPeople = preparedPeople.filter(person => person.sex === sex);
  }

  if (sortField) {
    preparedPeople.sort((person1, person2) => {
      const a = order === 'desc' ? person2[sortField] : person1[sortField];
      const b = order === 'desc' ? person1[sortField] : person2[sortField];

      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }

      if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
      }

      return 0;
    });
  }

  return preparedPeople;
}
