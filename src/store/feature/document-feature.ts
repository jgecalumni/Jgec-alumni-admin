import { baseApi } from "../baseApi";

interface IGetAllDocsRes {
	response: any;
	message: string;
	success: boolean;
	error: boolean;
}

interface IResponse {
	data: any;
	message: string;
	success: boolean;
	error: boolean;
}

export interface INotice {
	title: string;
	link?: string;
}

export const docsApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["getAllScholarshipsDocs", "addScholarshipsDocs","deleteScholarshipsDocs","updateScholDocs"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			getAllScholDocs: builder.query<IGetAllDocsRes, any>({
				query: () => ({
					url: "/documents/scholarshipDocs",
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["getAllScholarshipsDocs"],
			}),
			// getNoticeDetails: builder.query<IResponse, number>({
			//     query: (id) => ({
			//         url: `/notice/${id}`,
			//         method: 'GET',
			//         credentials: 'include'
			//     }),
			//     providesTags: ['notice-details']
			// }),
			addScholDocs: builder.mutation<IResponse, any>({
				query: (data) => ({
					url: "/documents/add/scholarshipDocs",
					method: "POST",
					credentials: "include",
					body: data,
				}),
				invalidatesTags: ["addScholarshipsDocs"],
			}),
			updateScholDocs: builder.mutation<IResponse, { formData: any, id: string }>({
			    query: ({ formData, id }) => ({
			        url: `/documents/update/scholarshipDocs/${id}`,
			        method: 'PATCH',
			        credentials: 'include',
			        body: formData
			    }),
			    invalidatesTags: ['updateScholDocs']
			}),
			deleteScholDocs: builder.mutation<IResponse, string>({
			    query: (id) => ({
			        url: `/documents/delete/scholarshipDocs/${id}`,
			        method: 'DELETE',
			        credentials: 'include'
			    }),
			    invalidatesTags: ['deleteScholarshipsDocs']
			}),
		}),
	});

export const { useGetAllScholDocsQuery, useAddScholDocsMutation,useDeleteScholDocsMutation,useUpdateScholDocsMutation } = docsApi;
