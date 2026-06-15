import { createMemoryHistory, createRouter } from 'vue-router';
import BackstageLayout from './layouts/BackstageLayout.vue';
import CaseSectionPage from './pages/backstage/CaseSectionPage.vue';
import InventorySectionPage from './pages/backstage/InventorySectionPage.vue';
import MapSectionPage from './pages/backstage/MapSectionPage.vue';
import AttributesSectionPage from './pages/backstage/AttributesSectionPage.vue';
import PhysiologySectionPage from './pages/backstage/PhysiologySectionPage.vue';
import RelationSectionPage from './pages/backstage/RelationSectionPage.vue';
import SkillsSectionPage from './pages/backstage/SkillsSectionPage.vue';
import StatusSectionPage from './pages/backstage/StatusSectionPage.vue';
import MainTerminalPage from './pages/MainTerminalPage.vue';

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', redirect: '/main' },
    { path: '/main', component: MainTerminalPage, meta: { title: '主终端·调查界面' } },
    { path: '/panels', redirect: '/backstage/attributes' },
    {
      path: '/backstage',
      component: BackstageLayout,
      meta: { title: '档案后台' },
      redirect: '/backstage/attributes',
      children: [
        { path: 'attributes', component: AttributesSectionPage, meta: { title: '基础属性' } },
        { path: 'skills', component: SkillsSectionPage, meta: { title: '技能' } },
        { path: 'physiology', component: PhysiologySectionPage, meta: { title: '生理数据' } },
        { path: 'status', component: StatusSectionPage, meta: { title: '异常状态' } },
        { path: 'inventory', component: InventorySectionPage, meta: { title: '装备与背包' } },
        { path: 'case', component: CaseSectionPage, meta: { title: '案件卷宗' } },
        { path: 'map', component: MapSectionPage, meta: { title: '地图与到访' } },
        { path: 'relation', component: RelationSectionPage, meta: { title: '关系与声望' } },
        { path: ':pathMatch(.*)*', redirect: '/backstage/attributes' },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/main' },
  ],
});
