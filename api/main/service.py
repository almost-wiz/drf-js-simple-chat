from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class Pagination(PageNumberPagination):
    page_size = 15
    max_page_size = 1000

    def get_paginated_response(self, data):
        isPaginated = False
        if self.get_next_link() or self.get_previous_link():
            isPaginated = True
        return Response({
            'isPaginated': isPaginated,
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'count': self.page.paginator.count,
            'pageSize': self.page_size,
            'loadedLength': len(data),
            'results': data
        })
