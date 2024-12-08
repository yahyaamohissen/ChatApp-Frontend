import axios from "axios";
import { PaginatedResult } from "../Models/PaginatedResult";
import { Message } from "../Models/Message";

export async function GetUserMessages (userId: number, friendUserName: string, pageNumber: number, pageSize: number) {

    var result = await axios.get<Message[]>(`api/${userId}/messages/friend/${friendUserName}/history`, {
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            friendUserName: friendUserName,
        }
    });

    return result.data;
}