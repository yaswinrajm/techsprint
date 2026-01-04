// Medicine Search API - NIH RxTerms
// https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search

export interface MedicineResult {
    id: string;
    name: string;
    strengths: string[];
}

export const searchMedicines = async (query: string): Promise<MedicineResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(
            `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(query)}&ef=STRENGTHS_AND_FORMS,RXCUIS`
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        // API returns: [total_count, [names], {field: [values]}]
        const names = data[1] || [];
        const details = data[2] || {};
        const strengths = details['STRENGTHS_AND_FORMS'] || [];

        return names.map((name: string, index: number) => ({
            id: index.toString(),
            name: name,
            strengths: strengths[index] || [],
        }));
    } catch (error) {
        console.error('Failed to fetch medicines:', error);
        return [];
    }
};
