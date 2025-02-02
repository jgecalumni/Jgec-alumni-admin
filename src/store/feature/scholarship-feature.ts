import { baseApi } from "../baseApi";

export const scholarshipApi = baseApi
    .enhanceEndpoints({ addTagTypes: ['scholarship', 'scholarship-details', 'add-scholarships', 'edit-scholarships', 'delete-scholarships'] })
    .injectEndpoints({
        endpoints: (builder) => ({
            allScholarships: builder.query<any, { limit?: number, page?: number, search?: string }>({
                query: ({ limit = 10, page = 1, search = "" }) => ({
                    url: '/scholarships',
                    params: { limit, page, search },
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['scholarship']
            }),
            scholarships: builder.query<any, string>({
                query: (id) => ({
                    url: `/scholarships/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }),
                providesTags: ['scholarship-details']
            }),
            addScholarships: builder.mutation<any, { data: any }>({
                query: ({ data }) => ({
                    url: '/scholarships/add',
                    method: 'POST',
                    credentials: 'include',
                    body: data
                }),
                invalidatesTags: ['add-scholarships']
            }),
            editScholarships: builder.mutation<any, { id: string, data: any }>({
                query: ({ id, data }) => ({
                    url: `/scholarships/update/${id}`,
                    method: 'PATCH',
                    credentials: 'include',
                    body: data
                }),
                invalidatesTags: ['edit-scholarships']
            }),
            deleteScholarships: builder.mutation<any, string>({
                query: (id) => ({
                    url: `/scholarships/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include'
                }),
                invalidatesTags: ['delete-scholarships']
            }),
        }),
    });

export const {
    useAllScholarshipsQuery,
    useScholarshipsQuery,
    useAddScholarshipsMutation,
    useEditScholarshipsMutation,
    useDeleteScholarshipsMutation
} = scholarshipApi;