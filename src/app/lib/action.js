import { 
    COMMITTEE_LISTING,
    ISSUE_TYPE_DETAILS,
    CREATE_ISSUE,
    ISSUE_LISTING,
    SHOW_ISSUE,
    Add_ISSUE_DESCRIPTION,
    ADD_ISSUE_DESCRIPTION_ACTION,
    EDIT_ISSUE,
    UPDATE_ISSUE_DESCRIPTION,
    UPDATE_ISSUE_DESCRIPTION_ACTION,
    MEMBER_CREATE,
    MEMBER_LISTING,
    VIEW_MEMBER,
    UPDATE_MEMBER,
    DELETE_MEMBER,
    DOCUMENT_LISTING
} from "./constant"

const getCommitteeListing = async () => {

    let url = process.env.NEXT_PUBLIC_URL+COMMITTEE_LISTING;
    
    let response = await fetch(url, {
        method: "POST"
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }

}

const getIssueTypeDetails = async (id) => {

    let url = process.env.NEXT_PUBLIC_URL+ISSUE_TYPE_DETAILS+'/'+id;
    
    let response = await fetch(url, {
        method: "GET"
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }

}

const createIssue = async (data) => {
    let url = process.env.NEXT_PUBLIC_URL+CREATE_ISSUE;
    
    let response = await fetch(url, {
        method: "POST",
        body: data,
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}
const editIssue = async (data) => {
    let url = process.env.NEXT_PUBLIC_URL+EDIT_ISSUE;
    
    let response = await fetch(url, {
        method: "POST",
        body: data,
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const getIssueLIsting = async (id) => {
    let url = process.env.NEXT_PUBLIC_URL+ISSUE_LISTING+'/'+id;
    
    let response = await fetch(url, {
        method: "GET"
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const getIssueDetail = async (id) => {

    let url = process.env.NEXT_PUBLIC_URL+SHOW_ISSUE+'/'+id;
    let response = await fetch(url, {
        method: "GET"
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const createIssueDescription = async (data, id) => {
    let url = process.env.NEXT_PUBLIC_URL+Add_ISSUE_DESCRIPTION+'/'+id;
    
    let response = await fetch(url, {
        method: "POST",
        body: data,
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const updateIssueDescription = async (data) => {
    let url = process.env.NEXT_PUBLIC_URL+UPDATE_ISSUE_DESCRIPTION;
    
    let response = await fetch(url, {
        method: "POST",
        body: data,
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const createIssueDescriptionAction = async (data) => {
    let url = process.env.NEXT_PUBLIC_URL+ADD_ISSUE_DESCRIPTION_ACTION;
    
    let response = await fetch(url, {
        method: "POST",
        body: data,
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const updateIssueDescriptionAction = async (data) => {
    let url = process.env.NEXT_PUBLIC_URL+UPDATE_ISSUE_DESCRIPTION_ACTION;
    
    let response = await fetch(url, {
        method: "POST",
        body: data,
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const getMembers = async () => {
    let url = process.env.NEXT_PUBLIC_URL+MEMBER_LISTING;
    console.log(url);
    let response = await fetch(url, {
        method: "POST"
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const createMember = async (data) => {
    let url = process.env.NEXT_PUBLIC_URL+MEMBER_CREATE;
    
    let response = await fetch(url, {
        method: "POST",
        body: data,
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const getMemberDetail = async (id) => {

    let url = process.env.NEXT_PUBLIC_URL+VIEW_MEMBER+'/'+id;
    
    let response = await fetch(url, {
        method: "GET"
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }

}

const updateMember = async (data) => {
    let url = process.env.NEXT_PUBLIC_URL+UPDATE_MEMBER;
    
    let response = await fetch(url, {
        method: "POST",
        body: data,
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const deleteMember = async (id) => {

    let url = process.env.NEXT_PUBLIC_URL+DELETE_MEMBER;
    let payload = {
        id:id
    }
    let response = await fetch(url, {
        method: "POST",
        body:JSON.stringify(payload)
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }

}

const getDocuments = async () => {
    let url = process.env.NEXT_PUBLIC_URL+DOCUMENT_LISTING;
    console.log(url);
    let response = await fetch(url, {
        method: "POST"
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if(response.ok && response.status == 200) {
        response = await response.json();
        return response;
    }
}

const Action = {
    getCommitteeListing,
    getIssueTypeDetails,
    createIssue,
    getIssueLIsting,
    getIssueDetail,
    createIssueDescription,
    createIssueDescriptionAction,
    editIssue,
    updateIssueDescription,
    updateIssueDescriptionAction,
    getMembers,
    createMember,
    getMemberDetail,
    updateMember,
    deleteMember,
    getDocuments
}

export default Action;