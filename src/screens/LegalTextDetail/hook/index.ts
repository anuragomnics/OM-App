import {useEffect, useState} from 'react';
import {MasterDataService} from '../../../services/MasterDataService';
import NewsService from '../../../services/PostsService';
import {LegalTextType} from '../../../types/responses/LegalTextDetailResponseType';
import {PostType} from '../../../types/responses/PostsListResponseType';
import {SingleNewsType} from '../../../types/responses/SingleNewsResposeType';

export const useSingleLawTextDetail = (id: number) => {
  const [legalText, setLegalText] = useState<LegalTextType | undefined>(
    undefined,
  );
  let isLoading: boolean = false;

  useEffect(() => {
    isLoading = true;
    async function fetchData() {
      try {
        const {legalTextDetail} =
          await MasterDataService.fetchLawTextDetailsById(id);
        setLegalText(legalTextDetail);
        isLoading = false;
      } catch (error) {
        isLoading = false;
        // eslint-disable-next-line no-console
        console.log('[ERROR] fetchData', error);
      }
    }
    fetchData();
  }, [id]);

  return {
    isLoading,
    legalText,
  };
};
