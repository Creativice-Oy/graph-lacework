export interface LaceworToken {
  expiresAt: string;
  token: string;
}

export interface LaceworPaginationResponse {
  paging: {
    rows: string;
    totalRows: string;
    urls: {
      nextPage: string;
    };
  };
}

export interface LaceworkTeamMembers {
  data: LaceworkTeamMember[];
}

export interface LaceworkTeamMember {
  custGuid: string;
  props: {
    firstName: string;
    lastName: string;
    company: string;
    jitCreated: boolean;
    accountAdmin: boolean;
    orgAdmin: boolean;
    orgUser: boolean;
    createdTime: string;
  };
  userEnabled: number;
  userGuid: string;
  userName: string;
}

export interface LaceworkContainer extends LaceworPaginationResponse {
  data: {
    startTime: string;
    endTime: string;
    mid: number;
    containerName: string;
    podName: string;
    imageId: string;
    props: {
      IMAGE_CREATED_TIME: string;
      IMAGE_ID: string;
      IMAGE_SIZE: number;
      IMAGE_TAG: string;
      IMAGE_VERSION: string;
      IMAGE_VIRTUAL_SIZE: number;
      IPV4: string;
      NAME: string;
      PID_MODE: string;
      POD_IP_ADDR: string;
      POD_TYPE: string;
      PRIVILEGED: number;
      PROPS_LABEL: any;
      VOLUME_MAP: any;
    };
    tags: any;
  }[];
}