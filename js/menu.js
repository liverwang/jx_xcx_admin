const Menu = [{
    page_name: "招标管理",
    page_list: [{
        page_name: "招标抓取管理",
        page_src: "tender/tender_list?source=crawler"
    }, {
        page_name: "招标信息管理",
        page_src: "tender/tender_list"
    }, {
        page_name: "废标单位统计",
        page_src: "tender/tender_scrap_list"
    }]
}, {
    page_name: "资源共享管理",
    page_list: [{
        page_name: "建造师管理",
        page_src: "share/share_constructor_list"
    }, {
        page_name: "企业转让管理",
        page_src: "share/share_transfer_list"
    }, {
        page_name: "开标拼车管理",
        page_src: "share/share_carpooling_list"
    }, {
        page_name: "招聘管理",
        page_src: "share/share_recruit_list"
    }, {
        page_name: "申请保函管理",
        page_src: "share/share_guarantee_list"
    }]
}, {
    page_name: "帐户管理",
    page_list: [{
        page_name: "用户管理",
        page_src: "account/account_list"
    }]
}, {
    page_name: "系统管理",
    page_list: [{
        page_name: "运营配置",
        page_src: "system/system_config"
    }, {
        page_name: "企业库",
        page_src: "system/system_enterprise_list"
    }]
}]