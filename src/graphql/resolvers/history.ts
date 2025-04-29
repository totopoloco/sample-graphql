import { IResolvers } from "@graphql-tools/utils";
import History from "../../models/History";
import { IHistory } from "../../types/models";
import { SortOrder } from "mongoose";

interface HistoryQueryArgs {
  modelName: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const historyResolvers: IResolvers = {
  Query: {
    history: async (_: any, { modelName, sortOrder = 'DESC' }: HistoryQueryArgs): Promise<IHistory[]> => {
      const query = { modelName };
      // Use the correct string values for Mongoose sort
      const sort = { 
        historyAt: (sortOrder === 'ASC' ? 1 : -1) as SortOrder 
      };

      return await History.find(query).sort(sort);
    }
  }
}