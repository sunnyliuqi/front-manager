import { queryList, save, update, get, del,checkName,checkUrl } from '@/services/sys/api/service';
import { message } from 'antd';

const initState = {
  pageKey: Math.random(),
  list: [], // table list
  current: {},
};

export default {
  namespace: 'sysapi',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sys/api' || location.pathname === '/sys/api/') {
          const state = { ...initState, ...{ pageKey: Math.random() } };
          dispatch({ type: 'updateState', payload: state });
        }
      });
    },
  },
  state: initState,

  effects: {
    // 分页list
    *queryList({ payload = {} }, { call, put }) {
      const page = { size: 10, current: 1 };
      const param = { ...page, ...payload };
      const { code, result } = yield call(queryList, param);
      if (result && code === 10000) {
        yield put({ type: 'updateState', payload: { list: result } });
      }
    },

    // 修改
    *edit({ payload = {} }, { call, put }) {
      const { code, result } = yield call(get, payload);
      if (code === 10000 && result) {
        yield put({ type: 'updateState', payload: { current: result, editLoading: false } });
      }
    },

    // 新增保存
    *save({ payload = {} }, { call }) {
      return yield call(save, payload);
    },

    // 修改保存
    *update({ payload = {} }, { call }) {
      return yield call(update, payload);
    },

    // 删除
    *delete({ payload = {} }, { call, put }) {
      const result = yield call(del, payload);
      if (result && result.code === 10000) {
        message.success(result.msg);
        yield put({ type: 'queryList' });
      }
      return result;
    },

    // 获取详情
    *get({ payload = {} }, { call, put }) {
      const { code, result } = yield call(get, payload);
      if (code === 10000 && result) {
        yield put({ type: 'updateState', payload: { current: result } });
      }
    },

    // checkName
    *checkName({ payload = {} }, { call }) {
      return  yield call(checkName, payload);
    },
    // checkUrl
    *checkUrl({ payload = {} }, { call }) {
      return  yield call(checkUrl, payload);
    },

  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
